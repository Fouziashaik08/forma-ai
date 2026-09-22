const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const formSchema = new mongoose.Schema({
  formTitle: String,
  formData: mongoose.Schema.Types.Mixed
})
const Form = mongoose.model('Form', formSchema)

app.get('/', (req, res) => {
  res.json({
    message: 'Forma AI backend is running'
  })
})

app.post('/api/forms', async (req, res) => {
  try {
const newForm = new Form({
  formTitle: req.body.formTitle || 'Generated Form',
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

// No-cost local form generator
app.post('/api/generate-form', (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({
        message: 'Prompt is required'
      })
    }

    const lowerPrompt = prompt.toLowerCase()

    let form = {
      title: 'Student Feedback Form',
      description: 'Please share your feedback with us.',
      fields: [
        {
          label: 'Your Name',
          type: 'text'
        },
        {
          label: 'Email Address',
          type: 'email'
        },
        {
          label: 'Your Feedback',
          type: 'textarea'
        }
      ]
    }

    if (lowerPrompt.includes('registration')) {
      form = {
        title: 'Registration Form',
        description: 'Please enter your registration details.',
        fields: [
          {
            label: 'Full Name',
            type: 'text'
          },
          {
            label: 'Email Address',
            type: 'email'
          },
          {
            label: 'Age',
            type: 'number'
          },
          {
            label: 'Date of Birth',
            type: 'date'
          }
        ]
      }
    }

    if (lowerPrompt.includes('contact')) {
      form = {
        title: 'Contact Form',
        description: 'Please enter your contact details.',
        fields: [
          {
            label: 'Name',
            type: 'text'
          },
          {
            label: 'Email Address',
            type: 'email'
          },
          {
            label: 'Message',
            type: 'textarea'
          }
        ]
      }
    }
    
if (lowerPrompt.includes('survey')) {
  form = {
    title: 'Survey Form',
    description: 'Please share your opinions and preferences.',
    fields: [
      {
        label: 'Your Name',
        type: 'text'
      },
      {
        label: 'Email Address',
        type: 'email'
      },
      {
        label: 'How satisfied are you?',
        type: 'text'
      },
      {
        label: 'Your Suggestions',
        type: 'textarea'
      }
    ]
  }
}

if (lowerPrompt.includes('event')) {
  form = {
    title: 'Event Registration Form',
    description: 'Please enter your details to register for the event.',
    fields: [
      {
        label: 'Full Name',
        type: 'text'
      },
      {
        label: 'Email Address',
        type: 'email'
      },
      {
        label: 'Phone Number',
        type: 'tel'
      },
      {
        label: 'Event Date',
        type: 'date'
      }
    ]
  }
}

    res.json(form)

  } catch (error) {
    console.error('Form generation failed:', error.message)

    res.status(500).json({
      message: 'Failed to generate form',
      error: error.message
    })
  }
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')

    app.listen(PORT, () => {
      console.log(`Forma AI backend running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
  })