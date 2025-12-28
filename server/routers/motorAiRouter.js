const router = require("express").Router();
const motorController = require("../controllers/motorAiController");

router.get("/image", motorController.getMotorcycleImage);

module.exports = router;
