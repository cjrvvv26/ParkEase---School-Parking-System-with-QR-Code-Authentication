const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/google", authController.authWithGoogle);
router.post("/register/verify-otp", authController.verifyUserOtp);

module.exports = router;
