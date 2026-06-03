const { Resend } = require('resend');
const dotenv = require('dotenv');
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const emailService = {
    sendMail: async (to, subject, htmlBody) => {
        try {
            console.log(`[Resend] Attempting to send mail to: ${to}`);
            
            const { data, error } = await resend.emails.send({
                from: 'PlaceDesk <onboarding@resend.dev>', // Keep this for the free tier
                to: [to],
                subject: subject,
                html: htmlBody,
            });

            if (error) {
                throw new Error(error.message);
            }

            console.log('[Resend] Email sent successfully. ID:', data.id);
            return { messageId: data.id };
        } catch (error) {
            console.error('[Resend] Critical Error:', error.message);
            throw new Error(`Email API Error: ${error.message}`);
        }
    }
};

module.exports = emailService;