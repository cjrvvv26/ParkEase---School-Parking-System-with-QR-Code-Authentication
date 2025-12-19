const express = require("express");
const router = express.Router();
const motorAiController = require("../controllers/motorAiController");

router.post("/image", motorAiController.customizePrompt);

module.exports = router;
