const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  feedback: String
})

const Form = mongoose.model('Form', formSchema)

app.get('/', (req, res) => {
  res.json({
    message: 'Forma AI backend is running'
  })
})

app.post('/api/forms', async (req, res) => {
  try {
    const newForm = new Form(req.body)
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