const accountSid = 'ACd16bc40c1b13adcf2b0e190fc45ef5ef';
const authToken = '15bc7dc71de7c79591dc451592666e83';
const client = require('twilio')(accountSid, authToken);

// client.messages
//     .create({
//         from: 'whatsapp:+14155238886',
//         contentSid: 'HX229f5a04fd0510ce1b071852155d3e75',
//         contentVariables: '{"1":"409173"}',
//         to: 'whatsapp:+919140395305'
//     })
//     .then(message => console.log(message.sid))
//     .done();

module.exports = client;