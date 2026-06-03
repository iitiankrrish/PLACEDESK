const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const emailService = {
    /**
     * Sends an email using the Brevo API (Bypasses Render SMTP blocks).
     * @param {string} to - Recipient email address.
     * @param {string} subject - Email subject.
     * @param {string} htmlBody - HTML content of the email.
     */
    sendMail: async (to, subject, htmlBody) => {
        try {
            console.log(`[Brevo] Attempting to dispatch email to: ${to}`);
            
            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    sender: { 
                        name: "IITR Placement Cell", 
                        email: "krrishraj.iitr@gmail.com" // This MUST be your verified Brevo email
                    },
                    to: [{ email: to }],
                    // IMPORTANT: This ensures that when the HR clicks "Reply", 
                    // the mail goes to your Gmail where your listener is watching.
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

            console.log('[Brevo] Success! Message ID:', response.data.messageId);
            
            // Return an object containing the ID so the controller can save it
            return { messageId: response.data.messageId };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            console.error('[Brevo] API Error:', errorMessage);
            throw new Error(`Email Dispatch Failed: ${errorMessage}`);
        }
    }
};

module.exports = emailService;