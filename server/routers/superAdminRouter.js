const router = require('express').Router();
const verifySession = require('../middlewares/verifyUser');
const requiredSuperAdmin = require('../middlewares/requiredSuperAdmin');
const superAdminController = require('../controllers/superAdminController');
const authController = require('../controllers/authController');
const upload = require('../middlewares/uploadImage');

router.post('/check-account', superAdminController.identifyAccountByEmail);
router.get('/id', superAdminController.getSuperAdminId);
router.get('/chat/:chatId', superAdminController.getChatMessages);
router.get('/chat-users', superAdminController.getChatUsers);
router.delete('/auth/cancel-verification', authController.cancelVerification);

//Protected API endpoints
router.use(verifySession(), requiredSuperAdmin);

//GET
router.get('/me', superAdminController.getDataBySession);

//POST
router.post(
  '/add-user/:folder',
  upload.single('profileDetails'),
  superAdminController.registerUser,
);

//PATCH
router.patch(
  '/me',
  upload.single('profileDetails'),
  superAdminController.updateInformation,
);
router.patch('/update-password', superAdminController.updatePassword);
router.patch('/deactivate/:id', superAdminController.deactivateUser);

//DELETE
router.delete('/sign-out', authController.signOutUser);
module.exports = router;
