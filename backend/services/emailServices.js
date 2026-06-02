const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const emailService = {
    sendMail: async (to, subject, htmlBody) => {
        try {
            console.log(`[Resend] Sending mail to ${to}...`);
            
            const response = await axios.post(
                'https://api.resend.com/emails',
                {
                    from: 'PlaceDesk <onboarding@resend.dev>', 
                    to: to,
                    subject: subject,
                    html: htmlBody,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('[Resend] Success! ID:', response.data.id);
            return { messageId: response.data.id };
        } catch (error) {
            console.error('[Resend] ERROR:', error.response?.data || error.message);
            throw new Error(`Email API Failed: ${error.response?.data?.message || error.message}`);
        }
    }
};

module.exports = emailService;