const assert = require('assert');
const path = require('path');
const fs = require('fs');

// Initialize mock process env variables
process.env.AMO_DOMAIN = 'test.amocrm.ru';
process.env.AMO_CLIENT_ID = 'test_client_id';
process.env.AMO_CLIENT_SECRET = 'test_client_secret';
process.env.AMO_REDIRECT_URI = 'test_redirect_uri';
process.env.AMO_ACCESS_TOKEN = 'initial_access_token';
process.env.AMO_REFRESH_TOKEN = 'initial_refresh_token';

process.env.TELEGRAM_BOT_TOKEN = 'test_bot_token';
process.env.TELEGRAM_CHAT_ID = 'test_chat_id';

// Load axios
const axios = require('axios');

// Intercept Axios calls using custom adapter
let adapterMockHandler = null;
axios.defaults.adapter = function(config) {
  if (adapterMockHandler) {
    return adapterMockHandler(config);
  }
  return Promise.reject(new Error('No mock handler defined'));
};

// Stub DB models BEFORE requiring the controller
const models = require('./models');
models.User.findByPk = async (id) => {
  console.log(`[DB Mock] User.findByPk called for ID: ${id}`);
  return {
    id,
    update: async (data) => {
      console.log(`[DB Mock] User update called with:`, data);
      return this;
    }
  };
};
models.OrderHistory.create = async (data) => {
  console.log(`[DB Mock] OrderHistory.create called with:`, data);
  return data;
};
models.CartHistory.destroy = async (query) => {
  console.log(`[DB Mock] CartHistory.destroy called with query:`, query);
  return 1;
};

// Now import the service and controller
const AmoCRMService = require('./services/amoCRMService');
const orderController = require('./controllers/orderController');

// Test runner helper
async function runTest(name, fn) {
  console.log(`\n========================================`);
  console.log(`RUNNING TEST: ${name}`);
  console.log(`========================================`);
  try {
    await fn();
    console.log(`✅ TEST PASSED: ${name}`);
  } catch (error) {
    console.error(`❌ TEST FAILED: ${name}`);
    console.error(error);
    process.exit(1);
  }
}

// Keep track of requests made to mock server
let requestsLog = [];

async function startTests() {
  // Save original env file contents so we can restore it at the end
  const envPath = path.resolve(__dirname, '.env');
  let originalEnvContent = '';
  if (fs.existsSync(envPath)) {
    originalEnvContent = fs.readFileSync(envPath, 'utf8');
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Find contact that already exists
    // ----------------------------------------------------
    await runTest('Contact Exists (Successful Flow)', async () => {
      requestsLog = [];
      adapterMockHandler = (config) => {
        requestsLog.push({ method: config.method, url: config.url, params: config.params });
        
        if (config.method === 'get' && config.url.includes('/api/v4/contacts')) {
          // Contact search matches clean phone 998901234567
          return Promise.resolve({
            status: 200,
            data: {
              _embedded: {
                contacts: [
                  {
                    id: 55555,
                    name: 'Azamjon Karimov',
                    custom_fields_values: [
                      {
                        field_code: 'PHONE',
                        values: [{ value: '+998 (90) 123 45 67' }]
                      }
                    ]
                  }
                ]
              }
            }
          });
        }
        return Promise.reject(new Error(`Unexpected request: ${config.method} ${config.url}`));
      };

      const contactId = await AmoCRMService.findOrCreateContact('Azamjon', 'Karimov', '+998 (90) 123 45 67');
      assert.strictEqual(contactId, 55555, 'Should return the existing contact ID');
      
      // Verify query calls
      const searchCall = requestsLog.find(r => r.url.includes('/api/v4/contacts'));
      assert.ok(searchCall, 'Should search contacts');
      assert.strictEqual(searchCall.params.query, '998901234567', 'Search query should be sanitized digits');
    });

    // ----------------------------------------------------
    // TEST 2: Find contact that does NOT exist (should create contact)
    // ----------------------------------------------------
    await runTest('Contact Does Not Exist -> Create Contact', async () => {
      requestsLog = [];
      adapterMockHandler = (config) => {
        requestsLog.push({ method: config.method, url: config.url, data: config.data ? JSON.parse(config.data) : null });
        
        if (config.method === 'get' && config.url.includes('/api/v4/contacts')) {
          // Return 204 No Content
          return Promise.resolve({ status: 204, data: null });
        }
        if (config.method === 'post' && config.url.includes('/api/v4/contacts')) {
          return Promise.resolve({
            status: 200,
            data: {
              _embedded: {
                contacts: [{ id: 66666 }]
              }
            }
          });
        }
        return Promise.reject(new Error(`Unexpected request: ${config.method} ${config.url}`));
      };

      const contactId = await AmoCRMService.findOrCreateContact('Mehmon', 'User', '+998 (90) 765 43 21');
      assert.strictEqual(contactId, 66666, 'Should create new contact and return new contact ID');
      
      // Verify create contact payload
      const createCall = requestsLog.find(r => r.method === 'post' && r.url.includes('/api/v4/contacts'));
      assert.ok(createCall, 'Should make post call to create contact');
      assert.strictEqual(createCall.data[0].first_name, 'Mehmon');
      assert.strictEqual(createCall.data[0].last_name, 'User');
      assert.strictEqual(createCall.data[0].custom_fields_values[0].values[0].value, '+998 (90) 765 43 21');
    });

    // ----------------------------------------------------
    // TEST 3: Create Lead and Note
    // ----------------------------------------------------
    await runTest('Create Lead and Note', async () => {
      requestsLog = [];
      adapterMockHandler = (config) => {
        requestsLog.push({ method: config.method, url: config.url, data: config.data ? JSON.parse(config.data) : null });
        
        if (config.method === 'post' && config.url.includes('/api/v4/leads') && !config.url.includes('/notes')) {
          return Promise.resolve({
            status: 200,
            data: {
              _embedded: {
                leads: [{ id: 77777 }]
              }
            }
          });
        }
        if (config.method === 'post' && config.url.includes('/api/v4/leads/77777/notes')) {
          return Promise.resolve({ status: 200, data: {} });
        }
        return Promise.reject(new Error(`Unexpected request: ${config.method} ${config.url}`));
      };

      const leadId = await AmoCRMService.createLead(55555, 'Azamjon', 'Karimov');
      assert.strictEqual(leadId, 77777);

      const leadPayload = requestsLog.find(r => r.method === 'post' && r.url.endsWith('/v4/leads'));
      assert.ok(leadPayload);
      assert.strictEqual(leadPayload.data[0].name, 'Yangi buyurtma - Azamjon Karimov');
      assert.strictEqual(leadPayload.data[0]._embedded.contacts[0].id, 55555, 'Lead must be linked to contact');

      await AmoCRMService.addLeadNote(77777, 'Test note text');
      const notePayload = requestsLog.find(r => r.url.includes('/notes'));
      assert.ok(notePayload);
      assert.strictEqual(notePayload.data[0].note_type, 'common');
      assert.strictEqual(notePayload.data[0].params.text, 'Test note text');
    });

    // ----------------------------------------------------
    // TEST 4: Automatic OAuth token refresh on 401 error
    // ----------------------------------------------------
    await runTest('Automatic OAuth Token Refresh (401 Interceptor)', async () => {
      requestsLog = [];
      process.env.AMO_ACCESS_TOKEN = 'EXPIRED_TOKEN';
      process.env.AMO_REFRESH_TOKEN = 'initial_refresh_token';

      adapterMockHandler = (config) => {
        requestsLog.push({ 
          method: config.method, 
          url: config.url, 
          authHeader: config.headers?.Authorization,
          contentType: config.headers?.['Content-Type'],
          data: config.data
        });
        
        if (config.url.includes('/api/v4/contacts')) {
          if (config.headers?.Authorization === 'Bearer EXPIRED_TOKEN') {
            // Return 401 Unauthorized for expired token
            return Promise.reject({
              response: { status: 401, data: { message: 'Unauthorized' } },
              config
            });
          } else if (config.headers?.Authorization === 'Bearer NEW_ACCESS_TOKEN') {
            // Return 200 for new token
            return Promise.resolve({
              status: 200,
              data: {
                _embedded: {
                  contacts: [{ id: 55555, custom_fields_values: [{ field_code: 'PHONE', values: [{ value: '998901234567' }] }] }]
                }
              }
            });
          }
        }
        
        if (config.url.includes('/oauth2/access_token')) {
          return Promise.resolve({
            status: 200,
            data: {
              access_token: 'NEW_ACCESS_TOKEN',
              refresh_token: 'NEW_REFRESH_TOKEN'
            }
          });
        }
        return Promise.reject(new Error(`Unexpected request: ${config.method} ${config.url}`));
      };

      const contactId = await AmoCRMService.findContactByPhone('+998 (90) 123 45 67');
      assert.strictEqual(contactId, 55555, 'Should retry and successfully return the contact ID');

      // Verify the flow sequence
      assert.strictEqual(requestsLog.length, 3, 'Flow should have 3 steps: 1. Fail Contact search, 2. Token refresh, 3. Retry Contact search');
      
      // Step 1: Failed Search
      assert.strictEqual(requestsLog[0].url, '/api/v4/contacts');
      assert.strictEqual(requestsLog[0].authHeader, 'Bearer EXPIRED_TOKEN');

      // Step 2: Refresh Tokens
      assert.strictEqual(requestsLog[1].url, 'https://test.amocrm.ru/oauth2/access_token');
      assert.strictEqual(requestsLog[1].contentType, 'application/x-www-form-urlencoded');
      assert.ok(requestsLog[1].data.includes('refresh_token=initial_refresh_token'));

      // Step 3: Retried Search
      assert.strictEqual(requestsLog[2].url, '/api/v4/contacts');
      assert.strictEqual(requestsLog[2].authHeader, 'Bearer NEW_ACCESS_TOKEN', 'Should carry the new access token');

      // Verify .env updates
      assert.strictEqual(process.env.AMO_ACCESS_TOKEN, 'NEW_ACCESS_TOKEN');
      assert.strictEqual(process.env.AMO_REFRESH_TOKEN, 'NEW_REFRESH_TOKEN');
    });

    // ----------------------------------------------------
    // TEST 5: Error Isolation - HTTP 403 / 500 / Network Error in AmoCRM
    // ----------------------------------------------------
    const errorScenarios = [
      { name: 'AmoCRM 403 Forbidden', mockResponse: () => Promise.reject({ response: { status: 403, data: 'Forbidden' } }) },
      { name: 'AmoCRM 500 Internal Error', mockResponse: () => Promise.reject({ response: { status: 500, data: 'Error' } }) },
      { name: 'AmoCRM Network Offline', mockResponse: () => Promise.reject(new Error('Network Error / Connection refused')) },
      { name: 'AmoCRM Request Timeout', mockResponse: () => Promise.reject(new Error('timeout of 5000ms exceeded')) }
    ];

    for (const scenario of errorScenarios) {
      await runTest(`Error Insulation - ${scenario.name}`, async () => {
        requestsLog = [];
        
        // Mock Telegram to return success
        adapterMockHandler = (config) => {
          requestsLog.push({ method: config.method, url: config.url });
          if (config.url.includes('telegram')) {
            return Promise.resolve({ status: 200, data: 'ok' });
          }
          // Trigger the mocked AmoCRM error
          return scenario.mockResponse();
        };

        const req = {
          body: {
            userId: 1,
            firstName: 'Azamjon',
            lastName: 'Karimov',
            phone: '+998 (90) 123 45 67',
            cartItems: [
              { id: 10, name: 'iPhone 16 Pro', quantity: 2, price: '24 000 000 UZS', priceValue: 12000000 }
            ],
            totalPrice: 24000000
          }
        };

        const res = {
          statusCode: null,
          jsonData: null,
          status: function(code) {
            this.statusCode = code;
            return this;
          },
          json: function(data) {
            this.jsonData = data;
            return this;
          }
        };

        // Call controller
        await orderController.submitOrder(req, res);

        // Assertions
        assert.strictEqual(res.statusCode, 200, 'Order controller response should be 200 despite AmoCRM failure');
        assert.ok(res.jsonData.success, 'Response body should indicate success');
        assert.strictEqual(res.jsonData.amoIntegrated, false, 'amoIntegrated should be false');
        assert.strictEqual(res.jsonData.telegramSent, true, 'telegramSent should be true');

        // Check that Telegram request was triggered
        const tgCall = requestsLog.find(r => r.url.includes('telegram'));
        assert.ok(tgCall, 'Telegram request should have been dispatched');
      });
    }

  } finally {
    // Restore original .env file contents
    if (originalEnvContent) {
      fs.writeFileSync(envPath, originalEnvContent, 'utf8');
    } else if (fs.existsSync(envPath)) {
      // If .env didn't exist, remove it
      fs.unlinkSync(envPath);
    }
  }
}

// Start execution
startTests().then(() => {
  console.log(`\n========================================`);
  console.log(`ALL TESTS COMPLETED SUCCESSFULLY!`);
  console.log(`========================================`);
}).catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
