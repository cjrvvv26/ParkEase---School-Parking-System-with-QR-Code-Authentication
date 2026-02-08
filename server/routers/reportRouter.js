const router = require("express").Router();
const reportController = require("../controllers/reportController");
const verifyUser = require("../middlewares/verifyUser");
const requiredSuperAdmin = require("../middlewares/requiredSuperAdmin");

router.use(verifyUser(), requiredSuperAdmin);

router.get("/parking-summary", reportController.getParkingSummary);

module.exports = router;
