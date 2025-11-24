// src/services/whatsapp.service.js
const client = require("../config/twilio");

async function sendWhatsApp(to, body) {
  try {
    const message = await client.messages.create({
  from: "whatsapp:+14155238886",
  contentSid: "HXb5b62575e6e4ff6129ad7c8efe1f983e",  
  contentVariables: JSON.stringify({
    "1": body// your OTP
  }),
  to: `whatsapp:+91${to}`,
});
console.log("Mobi")
    console.log("WhatsApp sent:", message.sid, );
    return message;
  } catch (error) {
    console.error("WhatsApp Error:", error);
    throw error;
  }
}

module.exports = { sendWhatsApp };
