require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = 5000;

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

app.get("/", (req, res) => {
  res.send("Forma AI Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});