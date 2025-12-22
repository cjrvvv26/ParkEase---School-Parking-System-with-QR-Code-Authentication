const express = require("express");
const router = express.Router();
const verifyUser = require("../middlewares/verifyUser");
const upload = require("../middlewares/uploadImage");
const studentController = require("../controllers/studentController");

//HTTP METHODS (API ENDPOINTS)
//DELETE
router.delete("/sign-out", studentController.signOutStudent);

//PROTECTED ROUTES
router.use(verifyUser("student_token"));
//GET
router.get("/me", studentController.getStudentData);

//POST
router.post("/auth/login", studentController.signInStudent);

//PATCH
router.patch(
  "/me",
  upload.single("profileDetails"),
  studentController.updateStudentData
);

module.exports = router;
