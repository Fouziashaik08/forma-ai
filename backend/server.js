const dns = require('dns')

dns.setServers(['8.8.8.8', '1.1.1.1'])

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// -----------------------------
// Field schema
// -----------------------------

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
})

// -----------------------------
// Main form schema
// -----------------------------

const formSchema = new mongoose.Schema({
  formTitle: {
    type: String,
    required: true
  },

  fields: {
    type: [fieldSchema],
    default: []
  },

  formData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
})

const Form = mongoose.model('Form', formSchema)

// -----------------------------
// Saved form model
// -----------------------------

const SavedForm = require('./models/SavedForm')

// -----------------------------
// Validate generated form
// -----------------------------

function validateForm(form) {
  if (!form || typeof form !== 'object') {
    return 'Form must be an object'
  }

  if (typeof form.title !== 'string' || form.title.trim() === '') {
    return 'Form title is required'
  }

  if (!Array.isArray(form.fields)) {
    return 'Form fields must be an array'
  }

  for (const field of form.fields) {
    if (!field || typeof field !== 'object') {
      return 'Each field must be an object'
    }

    if (typeof field.name !== 'string' || field.name.trim() === '') {
      return 'Each field must have a valid name'
    }

    if (typeof field.label !== 'string' || field.label.trim() === '') {
      return 'Each field must have a valid label'
    }

    if (typeof field.type !== 'string' || field.type.trim() === '') {
      return 'Each field must have a valid type'
    }

    if (typeof field.required !== 'boolean') {
      return 'Field required must be a boolean'
    }
  }

  return null
}

// -----------------------------
// Home route
// -----------------------------

app.get('/', (req, res) => {
  res.json({
    message: 'Forma AI backend is running'
  })
})

// -----------------------------
// Create / submit a form
// Existing API - keep this
// -----------------------------

app.post('/api/forms', async (req, res) => {
  try {
    const newForm = new Form({
      formTitle: req.body.formTitle || 'Generated Form',
      fields: req.body.fields || [],
      formData: req.body.formData || req.body
    })

    const savedForm = await newForm.save()

    res.status(201).json({
      message: 'Form submitted successfully',
      data: savedForm
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to save form',
      error: error.message
    })
  }
})

// -----------------------------
// Save / update partially completed form
// Week 4 - Save & Resume
// -----------------------------

app.post('/api/forms/save', async (req, res) => {
  try {
    const {
      formId,
      formTitle,
      formData,
      progress
    } = req.body

    if (!formId) {
      return res.status(400).json({
        message: 'formId is required'
      })
    }

    if (!formTitle) {
      return res.status(400).json({
        message: 'formTitle is required'
      })
    }

    const savedForm = await SavedForm.findOneAndUpdate(
      { formId },
      {
        formId,
        formTitle,
        formData: formData || {},
        progress: progress ?? 0
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    )

    res.status(200).json({
      message: 'Form saved successfully',
      data: savedForm
    })
  } catch (error) {
    console.error('Save form failed:', error.message)

    res.status(500).json({
      message: 'Failed to save form',
      error: error.message
    })
  }
})

// -----------------------------
// Get saved form by formId
// Week 4 - Save & Resume
// -----------------------------

app.get('/api/forms/:id', async (req, res) => {
  try {
    const savedForm = await SavedForm.findOne({
      formId: req.params.id
    })

    if (!savedForm) {
      return res.status(404).json({
        message: 'Saved form not found'
      })
    }

    res.json({
      message: 'Saved form retrieved successfully',
      data: savedForm
    })
  } catch (error) {
    console.error('Get saved form failed:', error.message)

    res.status(500).json({
      message: 'Failed to retrieve saved form',
      error: error.message
    })
  }
})
// Delete a saved form
app.delete('/api/forms/:id', async (req, res) => {
  try {
    const deletedForm = await SavedForm.findOneAndDelete({
      formId: req.params.id
    })

    if (!deletedForm) {
      return res.status(404).json({
        message: 'Saved form not found'
      })
    }

    res.json({
      message: 'Saved form deleted successfully',
      data: deletedForm
    })
  } catch (error) {
    console.error('Delete saved form failed:', error.message)

    res.status(500).json({
      message: 'Failed to delete saved form',
      error: error.message
    })
  }
})
// -----------------------------
// Get all submitted forms
// Existing API - keep this
// -----------------------------

app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find()

    res.json(forms)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch forms',
      error: error.message
    })
  }
})

// -----------------------------
// No-cost local form generator
// -----------------------------

app.post('/api/generate-form', (req, res) => {
  try {
    const { prompt } = req.body

    // Validate prompt
    if (typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({
        message: 'Prompt is required and must be a non-empty string'
      })
    }

    const lowerPrompt = prompt.toLowerCase()

    // Default form
    let form = {
      title: 'Student Feedback Form',
      description: 'Please share your feedback with us.',
      fields: [
        {
          name: 'name',
          label: 'Your Name',
          type: 'text',
          required: true,
          showIf: null
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          showIf: null
        },
        {
          name: 'feedback',
          label: 'Your Feedback',
          type: 'textarea',
          required: true,
          showIf: null
        }
      ]
    }

    // -------------------------
    // Registration form
    // -------------------------

    if (lowerPrompt.includes('registration')) {
      form = {
        title: 'Registration Form',
        description: 'Please enter your registration details.',
        fields: [
          {
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            required: true,
            showIf: null
          },
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            showIf: null
          },
          {
            name: 'age',
            label: 'Age',
            type: 'number',
            required: true,
            showIf: null
          },
          {
            name: 'dateOfBirth',
            label: 'Date of Birth',
            type: 'date',
            required: true,
            showIf: null
          }
        ]
      }
    }

    // -------------------------
    // Contact form
    // -------------------------

    if (lowerPrompt.includes('contact')) {
      form = {
        title: 'Contact Form',
        description: 'Please enter your contact details.',
        fields: [
          {
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
            showIf: null
          },
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            showIf: null
          },
          {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            required: true,
            showIf: null
          }
        ]
      }
    }

    // -------------------------
    // Survey form
    // Conditional field example
    // -------------------------

    if (lowerPrompt.includes('survey')) {
      form = {
        title: 'Survey Form',
        description: 'Please share your opinions and preferences.',
        fields: [
          {
            name: 'name',
            label: 'Your Name',
            type: 'text',
            required: true,
            showIf: null
          },
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            showIf: null
          },
          {
            name: 'isStudent',
            label: 'Are you a student?',
            type: 'checkbox',
            required: false,
            showIf: null
          },
          {
            name: 'collegeName',
            label: 'College Name',
            type: 'text',
            required: true,
            showIf: {
              field: 'isStudent',
              value: true
            }
          },
          {
            name: 'satisfaction',
            label: 'How satisfied are you?',
            type: 'text',
            required: true,
            showIf: null
          },
          {
            name: 'suggestions',
            label: 'Your Suggestions',
            type: 'textarea',
            required: false,
            showIf: null
          }
        ]
      }
    }

    // -------------------------
    // Event registration form
    // -------------------------

    if (lowerPrompt.includes('event')) {
      form = {
        title: 'Event Registration Form',
        description: 'Please enter your details to register for the event.',
        fields: [
          {
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            required: true,
            showIf: null
          },
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            showIf: null
          },
          {
            name: 'phone',
            label: 'Phone Number',
            type: 'tel',
            required: true,
            showIf: null
          },
          {
            name: 'eventDate',
            label: 'Event Date',
            type: 'date',
            required: true,
            showIf: null
          }
        ]
      }
    }

    // -------------------------
    // Validate generated form
    // -------------------------

    const validationError = validateForm(form)

    if (validationError) {
      return res.status(500).json({
        message: 'Generated form is invalid',
        error: validationError
      })
    }

    // -------------------------
    // Return generated form
    // -------------------------

    res.json({
      formTitle: form.title,
      description: form.description,
      fields: form.fields
    })

  } catch (error) {
    console.error('Form generation failed:', error.message)

    res.status(500).json({
      message: 'Failed to generate form',
      error: error.message
    })
  }
})

// -----------------------------
// MongoDB connection
// -----------------------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')

    app.listen(PORT, () => {
      console.log(
        `Forma AI backend running on http://localhost:${PORT}`
      )
    })
  })
  .catch((error) => {
    console.error(
      'MongoDB connection failed:',
      error.message
    )
  })