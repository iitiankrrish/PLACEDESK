const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    pool: true, 
    maxConnections: 5,
    connectionTimeout: 20000, 
    greetingTimeout: 20000,
    socketTimeout: 20000,
    tls: {
        rejectUnauthorized: false
    }
});

const emailService = {
    sendMail: async (to, subject, htmlBody, from = process.env.EMAIL_USER) => {
        try {
            const mailOptions = {
                from: `"IITR Placement Cell" <${from}>`, 
                to: to,
                subject: subject,
                html: htmlBody
            };
            
            console.log(`[SMTP] Attempting to send mail to ${to}...`);
            const info = await transporter.sendMail(mailOptions);
            console.log('[SMTP] Email sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('[SMTP] SEND ERROR:', error.message);
            throw new Error(`SMTP Connection Failed: ${error.message}`);
        }
    }
};

module.exports = emailService;