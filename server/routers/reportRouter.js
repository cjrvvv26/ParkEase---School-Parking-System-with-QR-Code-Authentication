const router = require('express').Router();
const reportController = require('../controllers/reportController');
const verifyUser = require('../middlewares/verifyUser');
const requiredSuperAdmin = require('../middlewares/requiredSuperAdmin');

router.use(verifyUser(), requiredSuperAdmin);

router.get('/parking-summary', reportController.getParkingSummary);
router.get('/system-summary', reportController.getSystemSummary);
router.get('/monthly-revenue', reportController.getMonthlyRevenue);
router.get('/occupancy-by-hour', reportController.getOccupancyByHour);
router.get('/avg-parking-by-hour', reportController.getAvgParkingByHour);
router.get('/preferred-areas', reportController.getPreferredAreas);
router.get('/top-parking-duration', reportController.getTopParkingDuration);
router.get('/weekly-scans', reportController.getWeeklyScans);

router.get('/users-by-course', reportController.getUsersByCourse);

router.get('/generate', reportController.generateReport);
router.get(
  '/generate/map/:mapId/slots/qr-code',
  reportController.generateSlotsQRCode,
);

module.exports = router;
