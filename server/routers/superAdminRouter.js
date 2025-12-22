const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadImage");
const verifyUser = require("../middlewares/verifyUser");
const superAdminController = require("../controllers/superAdminController");

//HTTP METHODS (API ENDPOINTS)
//PUBLIC ENDPOINTS
//POST (ACCOUNT)
router.post("/auth/google", superAdminController.userContinueGoogle);
router.post("/auth/login", superAdminController.signInSuperAdmin);
router.post("/auth/register", superAdminController.signUpSuperAdmin);
router.post("/auth/verify-otp", superAdminController.verifyUserOTP);
router.post("/auth/resend-otp", superAdminController.userResendOtp);

//DELETE
router.delete(
  "/auth/cancel-verification",
  superAdminController.cancelOtpVerification
);

//PROTECTED ENDPOINTS
router.use(verifyUser(), superAdminController.superAdminVerification);

//GET
router.get("/me", superAdminController.verifyUserSession);

//PATCH
router.patch(
  "/me",
  upload.single("profileDetails"),
  superAdminController.updateSuperAdminData
);
//POST (USER REGISTRATIONS)
router.post(
  "/register-student",
  upload.single("profileDetails"),
  superAdminController.registerStudent
);
router.post(
  "/register-guard",
  upload.single("profileDetails"),
  superAdminController.registerGuard
);

//DELETE
router.delete("/me", superAdminController.signOutSuperAdmin);

module.exports = router;
