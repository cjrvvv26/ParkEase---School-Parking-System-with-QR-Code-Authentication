const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/sign-in", authController.localSignIn);
router.post("/sign-up", authController.localSignUp);
router.post("/google", authController.authWithGoogle);
router.post("/verify-otp", authController.verifyUserOtp);
router.post("/resend-otp", authController.resendOtp);
router.delete("/cancel-verification", authController.cancelVerification);
router.post("/forgot-password/send-otp", authController.forgotPasswordSendOtp);
router.post("/forgot-password/verify-otp", authController.forgotPasswordVerifyOtp);
router.patch("/forgot-password/reset", authController.forgotPasswordReset);

module.exports = router;
