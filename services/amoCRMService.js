const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Helper to update token values in the .env file and in process.env
function updateEnvFile(updates) {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const lines = envContent.split(/\r?\n/);
    const updatedLines = [...lines];

    for (const [key, val] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*`);
      let found = false;
      for (let i = 0; i < updatedLines.length; i++) {
        if (regex.test(updatedLines[i])) {
          updatedLines[i] = `${key}=${val}`;
          found = true;
          break;
        }
      }
      if (!found) {
        updatedLines.push(`${key}=${val}`);
      }
    }

    fs.writeFileSync(envPath, updatedLines.join('\n'), 'utf8');
    
    // Update process.env in memory immediately
    for (const [key, val] of Object.entries(updates)) {
      process.env[key] = val;
    }
    console.log('[AmoCRMService] Successfully updated .env file on disk.');
  } catch (error) {
    console.error('[AmoCRMService] Error updating .env file:', error.message);
  }
}

// Helper to refresh OAuth tokens
async function refreshAmoTokens() {
  const domain = process.env.AMO_DOMAIN;
  const client_id = process.env.AMO_CLIENT_ID;
  const client_secret = process.env.AMO_CLIENT_SECRET;
  const redirect_uri = process.env.AMO_REDIRECT_URI;
  const refresh_token = process.env.AMO_REFRESH_TOKEN;

  if (!domain || !client_id || !client_secret || !refresh_token) {
    throw new Error('AmoCRM credentials or refresh token missing in environment');
  }

  console.log('[AmoCRMService] Refreshing access token...');
  const response = await axios.post(`https://${domain}/oauth2/access_token`, 
    new URLSearchParams({
      client_id,
      client_secret,
      grant_type: 'refresh_token',
      refresh_token,
      redirect_uri
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  const { access_token, refresh_token: new_refresh_token } = response.data;
  if (!access_token || !new_refresh_token) {
    throw new Error('OAuth refresh response did not return new tokens');
  }

  updateEnvFile({
    AMO_ACCESS_TOKEN: access_token,
    AMO_REFRESH_TOKEN: new_refresh_token
  });

  return {
    accessToken: access_token,
    refreshToken: new_refresh_token
  };
}

// Clean phone number (leave digits only)
function cleanPhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

// Axios client creator with automatic auth and token retry logic
const getAmoClient = () => {
  const domain = process.env.AMO_DOMAIN;
  const client = axios.create({
    baseURL: `https://${domain}`,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Request interceptor
  client.interceptors.request.use((config) => {
    if (process.env.AMO_ACCESS_TOKEN) {
      config.headers.Authorization = `Bearer ${process.env.AMO_ACCESS_TOKEN}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Response interceptor for token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response && 
        error.response.status === 401 && 
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const tokens = await refreshAmoTokens();
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return client(originalRequest);
        } catch (refreshErr) {
          console.error('[AmoCRMService] OAuth token refresh failed:', refreshErr.message);
          return Promise.reject(refreshErr);
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

class AmoCRMService {
  /**
   * Search contact by phone number. Returns contact ID if found, null otherwise.
   */
  static async findContactByPhone(phone) {
    const cleanedSearch = cleanPhone(phone);
    if (!cleanedSearch) return null;

    try {
      const client = getAmoClient();
      console.log(`[AmoCRMService] Searching for contact with phone: ${phone} (cleaned: ${cleanedSearch})`);
      
      const response = await client.get(`/api/v4/contacts`, {
        params: {
          query: cleanedSearch
        }
      });

      if (
        response.status === 204 || 
        !response.data || 
        !response.data._embedded || 
        !response.data._embedded.contacts
      ) {
        console.log('[AmoCRMService] Contact not found (empty query result).');
        return null;
      }

      const contacts = response.data._embedded.contacts;
      for (const contact of contacts) {
        if (contact.custom_fields_values) {
          for (const cf of contact.custom_fields_values) {
            if (cf.field_code === 'PHONE' && cf.values) {
              for (const v of cf.values) {
                if (cleanPhone(v.value) === cleanedSearch) {
                  console.log(`[AmoCRMService] Found existing contact. ID: ${contact.id}`);
                  return contact.id;
                }
              }
            }
          }
        }
      }

      console.log('[AmoCRMService] Contact not matched by exact digits in results.');
      return null;
    } catch (error) {
      console.error('[AmoCRMService] Error finding contact:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a new contact. Returns the new contact ID.
   */
  static async createContact(firstName, lastName, phone) {
    try {
      const client = getAmoClient();
      const fullName = `${firstName} ${lastName}`.trim();
      console.log(`[AmoCRMService] Creating new contact: ${fullName} (${phone})`);

      const payload = [
        {
          name: fullName,
          first_name: firstName,
          last_name: lastName,
          custom_fields_values: [
            {
              field_code: 'PHONE',
              values: [
                {
                  value: phone,
                  enum_code: 'MOB'
                }
              ]
            }
          ]
        }
      ];

      const response = await client.post('/api/v4/contacts', payload);
      const contactId = response.data?._embedded?.contacts?.[0]?.id;
      
      if (!contactId) {
        throw new Error('Contact creation response was missing ID');
      }

      console.log(`[AmoCRMService] Created contact successfully. ID: ${contactId}`);
      return contactId;
    } catch (error) {
      console.error('[AmoCRMService] Error creating contact:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Search for contact by phone. If not found, create it. Returns the contact ID.
   */
  static async findOrCreateContact(firstName, lastName, phone) {
    let contactId = await this.findContactByPhone(phone);
    if (!contactId) {
      contactId = await this.createContact(firstName, lastName, phone);
    }
    return contactId;
  }

  /**
   * Create a lead associated with the contact. Returns the new lead ID.
   */
  static async createLead(contactId, firstName, lastName) {
    try {
      const client = getAmoClient();
      const fullName = `${firstName} ${lastName}`.trim();
      const leadName = `Yangi buyurtma - ${fullName}`;
      console.log(`[AmoCRMService] Creating lead: "${leadName}" for Contact ID: ${contactId}`);

      const payload = [
        {
          name: leadName,
          _embedded: {
            contacts: [
              {
                id: contactId
              }
            ]
          }
        }
      ];

      const response = await client.post('/api/v4/leads', payload);
      const leadId = response.data?._embedded?.leads?.[0]?.id;

      if (!leadId) {
        throw new Error('Lead creation response was missing ID');
      }

      console.log(`[AmoCRMService] Created lead successfully. ID: ${leadId}`);
      return leadId;
    } catch (error) {
      console.error('[AmoCRMService] Error creating lead:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Add a note (description) to the lead.
   */
  static async addLeadNote(leadId, noteText) {
    try {
      const client = getAmoClient();
      console.log(`[AmoCRMService] Adding note to Lead ID: ${leadId}`);

      const payload = [
        {
          note_type: 'common',
          params: {
            text: noteText
          }
        }
      ];

      await client.post(`/api/v4/leads/${leadId}/notes`, payload);
      console.log('[AmoCRMService] Added note successfully.');
    } catch (error) {
      console.error('[AmoCRMService] Error adding lead note:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = AmoCRMService;
