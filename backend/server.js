require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Form schema routes
const formRoutes = require("./routes/formRoutes");
app.use("/api/forms", formRoutes);

// Saved submitted forms
const formSchema = new mongoose.Schema({
  formTitle: String,
  formData: mongoose.Schema.Types.Mixed
});

const Form = mongoose.model("Form", formSchema);

app.post("/api/submissions", async (req, res) => {
  try {
    const newForm = new Form({
      formTitle: req.body.formTitle || "Generated Form",
      formData: req.body.formData || req.body
    });

    const savedForm = await newForm.save();

    res.status(201).json({
      message: "Form submitted successfully",
      data: savedForm
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save form",
      error: error.message
    });
  }
});

app.get("/api/submissions", async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch forms",
      error: error.message
    });
  }
});

// AI form generation
app.post("/api/generate-form", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required"
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: `Create a form based on this request: ${prompt}

Return only JSON in this format:
{
  "title": "Form title",
  "description": "Short description",
  "fields": [
    {
      "label": "Field label",
      "type": "text"
    }
  ]
}

Allowed field types: text, email, number, textarea, date, checkbox.`,
    });

    const result = JSON.parse(response.output_text);

    res.json(result);
  } catch (error) {
    console.error("AI form generation failed:", error.message);

    res.status(500).json({
      message: "Failed to generate form",
      error: error.message
    });
  }
});

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Forma AI backend is running"
  });
});

app.listen(PORT, () => {
  console.log(`Forma AI backend running on http://localhost:${PORT}`);
});