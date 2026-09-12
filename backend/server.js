const express = require("express");

const app = express();

const PORT = 5000;

app.use(express.json());

// Form routes
const formRoutes = require("./routes/formRoutes");
app.use("/api/forms", formRoutes);

app.get("/", (req, res) => {
  res.send("Forma AI Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});