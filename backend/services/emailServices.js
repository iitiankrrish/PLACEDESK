const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Create the transporter with "Aggressive" connection settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Use 465 for SSL - more reliable on Render
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Production overrides for Render's jumpy network
    debug: true, // This will show detailed logs in Render console
    logger: true, // This will show detailed logs in Render console
    connectionTimeout: 30000, // 30 seconds (be patient with cloud network)
    greetingTimeout: 30000,
    socketTimeout: 30000,
    dnsTimeout: 10000,
    tls: {
        rejectUnauthorized: false, // Prevents certificate handshake errors
        servername: 'smtp.gmail.com'
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
            
            console.log(`[SMTP] Attempting connection to Gmail for ${to}...`);
            
            // Verify connection before sending
            await transporter.verify();
            console.log("[SMTP] Connection verified. Sending data...");

            const info = await transporter.sendMail(mailOptions);
            console.log('[SMTP] Success! ID: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('[SMTP] CRITICAL SEND ERROR:', error.message);
            // Check for common Render issues
            if (error.message.includes('ETIMEDOUT')) {
                throw new Error("SMTP Timeout: Render's network is blocking the connection to Gmail.");
            }
            throw new Error(`Mail System Failure: ${error.message}`);
        }
    }
};

module.exports = emailService;