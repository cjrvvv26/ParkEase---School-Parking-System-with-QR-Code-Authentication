const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/sign-in", authController.localSignIn);
router.post("/google", authController.authWithGoogle);
router.post("/verify-otp", authController.verifyUserOtp);
router.post("/resend-otp", authController.resendOtp);

module.exports = router;
