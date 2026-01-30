const router = require("express").Router();
const motorController = require("../controllers/motorAiController");

router.post("/image", motorController.getMotorcycleImage);

module.exports = router;
