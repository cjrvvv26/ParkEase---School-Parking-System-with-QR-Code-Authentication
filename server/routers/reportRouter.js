const router = require("express").Router();
const reportController = require("../controllers/reportController");
const verifyUser = require("../middlewares/verifyUser");
const requiredSuperAdmin = require("../middlewares/requiredSuperAdmin");

router.use(verifyUser(), requiredSuperAdmin);

router.get("/parking-summary", reportController.getParkingSummary);
router.get("/system-summary", reportController.getSystemSummary);
router.get("/monthly-revenue", reportController.getMonthlyRevenue);

module.exports = router;
