const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//PATCH
router.patch("/verify-email", userController.verifyUserAccount);

module.exports = router;
