const express = require("express");
const router = express.Router();
const verifyUser = require("../middlewares/verifyUser");
const guardController = require("../controllers/guardController");
const upload = require("../middlewares/uploadImage");

//HTTP METHODS (API ENDPOINTS)

//GET

//POST
router.post("/auth/login", guardController.signInSecurity);
router.post(
  "/auth/register",
  upload.single("profileDetails"),
  guardController.signUpSecurity
);

//PATCH
router.patch(
  "/me",
  verifyUser("guard_token"),
  upload.single("profileDetails"),
  guardController.updateGuardData
);
module.exports = router;
