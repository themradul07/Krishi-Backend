// src/services/whatsapp.service.js
const client = require("../config/twilio");

async function sendWhatsApp(body, to) {
  try {
    const message = await client.messages.create({
      from: "whatsapp:+14155238886",
        body,
      to: `whatsapp:${to}`,
    });

    console.log("WhatsApp sent:", message.sid);
    return message;
  } catch (error) {
    console.error("WhatsApp Error:", error);
    throw error;
  }
}

module.exports = { sendWhatsApp };
