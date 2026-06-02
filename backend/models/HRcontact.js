const mongoose = require('mongoose');

const HRContactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true, 
        trim: true, 
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'] 
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        trim: true,
        default: 'HR Manager' 
    },
    linkedInProfile: {
        type: String,
        trim: true,
        default: null,
        match: [
            /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
            'Please enter a valid LinkedIn profile URL'
        ]
    },
    notes: {
        type: String,
        trim: true,
        default: '' 
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
}, { timestamps: true }); 

module.exports = mongoose.model('HRContact', HRContactSchema);