const express = require("express");
const router = express.Router();
const verifyUser = require("../middlewares/verifyUser");
const guardController = require("../controllers/guardController");
const upload = require("../middlewares/uploadImage");

//HTTP METHODS (API ENDPOINTS)
router.use(verifyUser("guard_token"));
//GET
router.get("/me", guardController.getGuardData);
//POST
router.post("/auth/login", guardController.signInSecurity);

//PATCH
router.patch(
  "/me",
  upload.single("profileDetails"),
  guardController.updateGuardData
);
module.exports = router;
