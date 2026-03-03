const router = require('express').Router();
const userController = require('../controllers/userController');
const verifyUser = require('../middlewares/verifyUser');
const requiredSuperAdmin = require('../middlewares/requiredSuperAdmin');
const upload = require('../middlewares/uploadImage');

router.patch('/recovery/reset-password', userController.resetUserPassword);

router.use(verifyUser(), requiredSuperAdmin);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch(
  '/:id',
  upload.single('profileDetails'),
  userController.updateUserDataBySA,
);
router.post('/available', userController.getAvailableUsers);

module.exports = router;
