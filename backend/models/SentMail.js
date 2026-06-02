const mongoose = require('mongoose');

const SentMailSchema = new mongoose.Schema({
    senderEmail: { type: String, default: 'pic@iitr.ac.in', required: true },
    recipientEmail: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    status: {
        type: String,
        enum: ['Sent', 'Failed', 'Pending Reply', 'Replied', 'Follow-up Sent'],
        default: 'Sent',
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReceivedMail'
    }],
    sentAt: { type: Date, default: Date.now },
    repliedAt: { type: Date, default: null },
    expectedReplyBy: { type: Date, default: null },
    followUpAfterDays: { type: Number, default: 7 },
    followUpCount: { type: Number, default: 0 },
    maxFollowUps: { type: Number, default: 3 },
    lastFollowUpSentAt: { type: Date, default: null },
    isFollowUpScheduled: { type: Boolean, default: true },
    companyName: { type: String, default: null },
    hrName: { type: String, default: null },
    messageId: {
        type: String, 
        unique: true,
        sparse: true, 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    originalMail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SentMail', 
        default: null,
    },
}, { timestamps: true }); 

module.exports = mongoose.model('SentMail', SentMailSchema);