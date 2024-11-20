// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['Work', 'Personal', 'Urgent'], default: 'Personal' },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
