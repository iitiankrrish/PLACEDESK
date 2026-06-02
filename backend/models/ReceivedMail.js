const mongoose = require('mongoose');

const internshipInfoSchema = new mongoose.Schema({
  company_name: { type: String, default: "Not mentioned" },
  position: { type: String, default: "Not mentioned" },
  stipend: { type: String, default: "Not mentioned" },
  eligible_branches: { type: String, default: "All" },
  minimum_cgpa: { type: String, default: "No criteria" },
  skills_required: { type: String, default: "Not mentioned" },
  visit_date: { type: String, default: "TBD" },
  selection_process: { type: String, default: "Not mentioned" },
  additional_notes: { type: String, default: null },
}, { _id: false });

const receivedMailSchema = new mongoose.Schema({
  messageId: { type: String, unique: true, required: true }, 
  subject: { type: String, required: true },
  from: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  tone: { type: String, enum: ['Neutral', 'Positive', 'Negative', 'Unknown'], default: 'Neutral' },
  rating: { type: Number, min: 1, max: 5, default: 3 },
  summary: { type: String, default: '' },
  important_summary: { type: String, default: null },
  internship_info: { type: internshipInfoSchema, default: null },
  is_relevant: { type: Boolean, default: false },
  relatedSentMail: { type: mongoose.Schema.Types.ObjectId, ref: 'SentMail', default: null },
});

module.exports = mongoose.model('ReceivedMail', receivedMailSchema);