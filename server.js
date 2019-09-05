const express = require("express");
const connection = require("./config/db");
const app = express();

connection();

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Port is running on ${PORT}`));
