const express = require("express");
const FormSchema = require("../models/FormSchema");

const router = express.Router();

// Create a new form
router.post("/", async (req, res) => {
  try {
    const form = new FormSchema(req.body);
    const savedForm = await form.save();

    res.status(201).json(savedForm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all forms
router.get("/", async (req, res) => {
  try {
    const forms = await FormSchema.find();

    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;