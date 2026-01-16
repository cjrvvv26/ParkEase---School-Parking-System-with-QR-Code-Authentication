const router = require("express").Router();
const userController = require("../controllers/userController");
const studentController = require("../controllers/studentController");
const verifyUser = require("../middlewares/verifyUser");

router.use(verifyUser("student_token"));

router.post("/:id", userController.updateUserData);
router.get("/attendance", studentController.registerAttendance);

module.exports = router;
