const router = require('express').Router();
const userController = require('../controllers/userController');
const verifyUser = require('../middlewares/verifyUser');
const requiredSuperAdmin = require('../middlewares/requiredSuperAdmin');
const upload = require('../middlewares/uploadImage');

router.get(
  '/recovery/verify-request/:token',
  userController.verifyAccountRequest,
);
router.get('/token/:token', userController.getUserByToken);

router.post('/recovery/send-request', userController.sendRecoveryRequest);

router.patch('/recovery/reset-password', userController.resetUserPassword);

router.patch('/me', verifyUser(), userController.updateSelf);
router.patch('/me/password', verifyUser(), userController.changePassword);

router.use(verifyUser(), requiredSuperAdmin);

router.get('/', userController.getAllUsers);
router.get('/search', userController.getUsersByName);
router.get('/:id', userController.getUserById);
router.patch(
  '/:id',
  (req, res, next) => {
    upload.single('profileDetails')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || String(err) });
      }
      next();
    });
  },
  userController.updateUserDataBySA,
);
router.post('/available', userController.getAvailableUsers);

module.exports = router;
