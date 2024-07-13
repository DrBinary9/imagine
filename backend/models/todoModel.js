const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = new Schema({
  step: {
    type: String,
    required: true
  }
}, { _id: false });

const componentSchema = new Schema({
  component: {
    type: String,
    required: true
  }
}, { _id: false });

const taskSchema = new Schema({
  task: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  steps: {
    type: [stepSchema],
    required: false
  },
  components: {
    type: [componentSchema],
    required: false
  }
}, { _id: true });

const conversationSchema = new Schema({
  conversation: {
    type: [taskSchema],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
