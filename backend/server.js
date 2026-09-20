require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Form routes
const formRoutes = require("./routes/formRoutes");
app.use("/api/forms", formRoutes);

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

app.get("/", (req, res) => {
  res.send("Forma AI Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});