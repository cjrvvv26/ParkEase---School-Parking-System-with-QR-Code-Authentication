const express = require("express");
const router = express.Router();
const verifyUser = require("../middlewares/verifyUser");
const requiredSuperAdmin = require("../middlewares/requiredSuperAdmin");
const activityController = require("../controllers/activityController");

router.use(verifyUser(), requiredSuperAdmin);

router.get("/", activityController.getAllLogs);
router.get("/user/:userId", activityController.getUserLogs);

module.exports = router;
