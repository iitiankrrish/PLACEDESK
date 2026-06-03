const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const emailService = {
    sendMail: async (to, subject, htmlBody) => {
        try {
            console.log(`[Brevo] Attempting to dispatch email to: ${to}`);
            
            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    sender: { 
                        name: "IITR Placement Cell", 
                        email: "krrishraj.iitr@gmail.com" 
                    },
                    to: [{ email: to }],
                    replyTo: { email: "krrishraj.iitr@gmail.com" },
                    subject: subject,
                    htmlContent: htmlBody,
                },
                {
                    headers: {
                        'api-key': process.env.BREVO_API_KEY,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Success! Message ID:', response.data.messageId);
            return { messageId: response.data.messageId };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            console.error('API Error:', errorMessage);
            throw new Error(`Email Dispatch Failed: ${errorMessage}`);
        }
    }
};

module.exports = emailService;