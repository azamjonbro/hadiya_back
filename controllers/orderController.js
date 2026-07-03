const { User, OrderHistory, CartHistory } = require('../models');
const AmoCRMService = require('../services/amoCRMService');
const axios = require('axios');

const formatPrice = (price) => {
  return price.toLocaleString('ru-RU') + ' UZS';
};

const formatAmoPrice = (price) => {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ') + " so'm";
};

exports.submitOrder = async (req, res) => {
  const { userId, firstName, lastName, phone, cartItems, totalPrice } = req.body;

  if (!firstName || !lastName || !phone || !cartItems || !cartItems.length) {
    return res.status(400).json({ error: 'Missing required order details' });
  }

  try {
    // 1. Update User info in DB
    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({ firstName, lastName, phone });
      }
    }

    // 2. Add to Order History and Clear Cart History in DB
    for (const item of cartItems) {
      await OrderHistory.create({
        userId,
        productId: item.id,
        ProductId: String(item.id),
        quantity: item.quantity,
        history: JSON.stringify({
          address: `${firstName} ${lastName}, ${phone}`,
          status: 'Kutilmoqda',
          message: `Ordered ${item.quantity} units of ${item.name} for ${item.price || formatPrice(item.priceValue)}`
        })
      });

      // Clear from CartHistory
      if (userId) {
        await CartHistory.destroy({
          where: {
            userId: userId,
            productId: item.id
          }
        });
      }
    }

    // 3. Send Telegram Notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    let telegramSent = false;
    if (botToken && chatId && botToken !== 'YOUR_BOT_TOKEN' && chatId !== 'YOUR_CHAT_ID') {
      try {
        const productsDetails = cartItems
          .map(item => `• ${item.name} (${item.quantity} dona) - ${formatPrice(item.priceValue * item.quantity)}`)
          .join('\n');

        const message = `
🔔 YANGI BUYURTMA!

👤 Buyurtmachi: ${firstName} ${lastName}
📞 Telefon: ${phone}

📦 Mahsulotlar:
${productsDetails}

💰 Jami summa: ${formatPrice(totalPrice)}
        `;

        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          chat_id: chatId,
          text: message.trim()
        });
        telegramSent = true;
      } catch (tgError) {
        console.error('[OrderController] Telegram notification failed:', tgError.message);
      }
    }

    // 4. AmoCRM Integration (insulated in try-catch so it won't crash order flow)
    let amoIntegrated = false;
    let amoDetails = {};
    
    try {
      const amoDomain = process.env.AMO_DOMAIN;
      if (amoDomain && amoDomain !== 'your_subdomain.amocrm.ru') {
        console.log('[OrderController] Starting AmoCRM integration...');
        
        // Find or create Contact
        const contactId = await AmoCRMService.findOrCreateContact(firstName, lastName, phone);
        
        // Create Lead
        const leadId = await AmoCRMService.createLead(contactId, firstName, lastName);
        
        // Format note text description
        const productsNoteLines = cartItems.map(item => {
          return `• ${item.name}\n${item.quantity} dona\n${formatAmoPrice(item.priceValue * item.quantity)}`;
        }).join('\n\n');

        const noteText = `Mijoz:\n${firstName} ${lastName}\n${phone}\n\nMahsulotlar:\n\n${productsNoteLines}\n\nJami:\n${formatAmoPrice(totalPrice)}`;
        
        // Add note to Lead
        await AmoCRMService.addLeadNote(leadId, noteText);
        
        amoIntegrated = true;
        amoDetails = { contactId, leadId };
      } else {
        console.log('[OrderController] AmoCRM integration skipped (missing or default credentials).');
      }
    } catch (amoError) {
      const errorMsg = amoError.response?.data ? JSON.stringify(amoError.response.data) : (amoError.message || amoError);
      console.error('[OrderController] AmoCRM integration failed:', errorMsg);
    }

    // 5. Respond with success status
    return res.status(200).json({
      success: true,
      message: 'Order processed successfully',
      telegramSent,
      amoIntegrated,
      amoDetails
    });

  } catch (error) {
    console.error('[OrderController] Order submission error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
