const mongoose = require('mongoose')

const savedFormSchema = new mongoose.Schema(
  {
    formId: {
      type: String,
      required: true,
      unique: true
    },

    formTitle: {
      type: String,
      required: true
    },

    formData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('SavedForm', savedFormSchema)