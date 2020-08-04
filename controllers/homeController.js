const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();
let isCorrect="";

router.get("/", (req, res) => {
  res.render("index.ejs",{exists:isCorrect})
});

module.exports = router;