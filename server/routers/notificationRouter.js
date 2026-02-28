const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const verifyUser = require('../middlewares/verifyUser');
const requiredSuperAdmin = require('../middlewares/requiredSuperAdmin');

router.use(verifyUser(), requiredSuperAdmin);

router.get('/', notificationController.getNotifications);
router.delete('/:id', notificationController.deleteNotification);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;
