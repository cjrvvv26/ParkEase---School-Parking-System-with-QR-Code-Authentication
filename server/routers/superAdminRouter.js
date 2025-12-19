const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadImage");
const verifyUser = require("../middlewares/verifyUser");
const superAdminController = require("../controllers/superAdminController");

//HTTP METHODS (API ENDPOINTS)

//GET
router.get("/me", verifyUser(), superAdminController.verifyUserSession);

//POST (ACCOUNT)
router.post("/auth/google", superAdminController.userContinueGoogle);
router.post("/auth/login", superAdminController.signInSuperAdmin);
router.post("/auth/register", superAdminController.signUpSuperAdmin);
router.post("/auth/verify-otp", superAdminController.verifyUserOTP);
router.post("/auth/resend-otp", superAdminController.userResendOtp);

//POST (USER REGISTRATIONS)
router.post(
  "/register-student",
  verifyUser(),
  upload.single("profileDetails"),
  superAdminController.registerStudent
);

//DELETE
router.delete(
  "/auth/cancel-verification",
  superAdminController.cancelOtpVerification
);

module.exports = router;
