const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const ML_API_BASE_URL = process.env.ML_API_BASE_URL ; 
const aiIntegrationService = {
    async generateMailContent(payload) {
        try {
            const response = await axios.post(`https://syntaxerror-1.onrender.com/generate-email`, payload);
            if (!response.data || !response.data.subject || !response.data.body) {
                throw new Error("Invalid response from LLM API for mail generation.");
            }
            return response.data; 
        } catch (error) {
            console.error('Error generating mail content via LLM:', error.message);
            if (error.response) {
                console.error('LLM API response error:', error.response.data);
            }
            throw new Error('Failed to generate mail content from AI.');
        }
    },
    async processReceivedMail(emailContent) {
        try {
            const response = await axios.post(`${ML_API_BASE_URL}/process-mail`, emailContent);
            if (!response.data || !response.data.sentiment || !response.data.extractedInfo) {
                throw new Error("Invalid response from ML API for mail processing.");
            }
            return response.data;
        } catch (error) {
            console.error('Error processing received mail via ML:', error.message);
            if (error.response) {
                console.error('ML API response error:', error.response.data);
            }
            throw new Error('Failed to process received mail with AI.');
        }
    },
    async generateFollowUpMail(payload) {
        try {
            const response = await axios.post(`${ML_API_BASE_URL}/generate-followup`, payload);
            if (!response.data || !response.data.subject || !response.data.body) {
                throw new Error("Invalid response from LLM API for follow-up generation.");
            }
            return response.data;
        } catch (error) {
            console.error('Error generating follow-up mail via LLM:', error.message);
            if (error.response) {
                console.error('LLM API response error:', error.response.data);
            }
            throw new Error('Failed to generate follow-up mail from AI.');
        }
    }
};

module.exports = aiIntegrationService;
