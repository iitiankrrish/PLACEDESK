const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,        
    port: parseInt(process.env.EMAIL_PORT || '587', 10), 
    secure: process.env.EMAIL_SECURE === 'true', 
    auth: {
        user: process.env.EMAIL_USER,    
        pass: process.env.EMAIL_PASS     
    },
});

const emailService = {
    sendMail: async (to, subject, htmlBody, from = process.env.EMAIL_USER) => {
        try {
            const mailOptions = {
                from: from,
                to: to,
                subject: subject,
                html: htmlBody
            };
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error(`Failed to send email to ${to}: ${error.message}`);
        }
    }
};

module.exports = emailService;