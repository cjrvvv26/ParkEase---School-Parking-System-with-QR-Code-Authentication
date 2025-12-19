const express = require("express");
const router = express.Router();
const verifyUser = require("../middlewares/verifyUser");
const upload = require("../middlewares/uploadImage");
const studentController = require("../controllers/studentController");
//HTTP METHODS (API ENDPOINTS)

//GET
router.get(
  "/me",
  verifyUser("student_token"),
  studentController.verifyStudentSession
);

//POST
router.post("/auth/login", studentController.signInStudent);

//PATCH
router.patch(
  "/me",
  verifyUser("student_token"),
  upload.single("profileDetails"),
  studentController.updateStudentData
);

//DELETE
router.delete("/sign-out", studentController.signOutStudent);
module.exports = router;
