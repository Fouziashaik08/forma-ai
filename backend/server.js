require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) =>
    console.error("MongoDB connection failed:", error.message)
  );

// Form routes
const formRoutes = require("./routes/formRoutes");
app.use("/api/forms", formRoutes);

// Submission schema
const formSchema = new mongoose.Schema({
  formTitle: String,
  formData: mongoose.Schema.Types.Mixed
});

const Form = mongoose.model("Form", formSchema);

// Save form submission
app.post("/api/submissions", async (req, res) => {
  try {
    const { formTitle, formData } = req.body;

    const newForm = new Form({
      formTitle,
      formData
    });

    await newForm.save();

    res.json({
      message: "Form submitted successfully!",
      data: newForm
    });
  } catch (error) {
    console.error("Submission failed:", error.message);

    res.status(500).json({
      message: "Failed to submit form",
      error: error.message
    });
  }
});

// Get submissions
app.get("/api/submissions", async (req, res) => {
  try {
    const submissions = await Form.find();

    res.json(submissions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch submissions",
      error: error.message
    });
  }
});

// Generate form using AI
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
      "type": "text",
      "value": ""
    }
  ]
}

If the user's request contains information that matches a field,
put that information in "value".

If no information is available for a field,
keep "value" as an empty string.

Allowed field types:
text, email, number, textarea, date, checkbox.`
    });

    const result = JSON.parse(response.output_text);

    res.json(result);

  } catch (error) {

    console.error("AI form generation failed:", error.message);

    // TEMPORARY FALLBACK
    // Used while OpenAI API credits are unavailable.
    res.json({
      title: "Student Information Form",
      description: "Please review and complete your information.",
      fields: [
        {
          label: "Name",
          type: "text",
          value: "Fouzia"
        },
        {
          label: "Course",
          type: "text",
          value: "BTech Computer Science"
        },
        {
          label: "Email",
          type: "email",
          value: ""
        },
        {
          label: "Date of Birth",
          type: "date",
          value: ""
        }
      ]
    });
  }
});

// Test backend
app.get("/", (req, res) => {
  res.json({
    message: "Forma AI backend is running"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Forma AI backend running on http://localhost:${PORT}`
  );
});