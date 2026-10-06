const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  label: {
    type: String,
    required: true
  },

  type: {
    type: String,
    required: true
  },

  required: {
    type: Boolean,
    default: false
  },

  showIf: {
    type: Object,
    default: null
  }
});

const formSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: true
  },

  fields: {
    type: [fieldSchema],
    default: []
  }
});

module.exports = mongoose.model("FormSchema", formSchema);