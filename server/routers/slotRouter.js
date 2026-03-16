const router = require('express').Router();
const slotController = require('../controllers/slotController');
const verifyUser = require('../middlewares/verifyUser');
const requiredSuperAdmin = require('../middlewares/requiredSuperAdmin');

router.get('/available', slotController.getAvailableSlots);
router.post('/verify-scan', slotController.verifyUserSlot);

router.use(verifyUser(), requiredSuperAdmin);

router.post('/', slotController.getSlotDetails);
router.post('/assign', slotController.assignStudentSlot);
router.post('/move', slotController.updateStudentLocation);
router.post('/remove', slotController.removeAssignment);

module.exports = router;
