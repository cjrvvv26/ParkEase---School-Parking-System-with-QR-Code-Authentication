const router = require("express").Router();
const verifySession = require("../middlewares/verifyUser");
const requiredSuperAdmin = require("../middlewares/requiredSuperAdmin");
const superAdminController = require("../controllers/superAdminController");
const authController = require("../controllers/authController");
const upload = require("../middlewares/uploadImage");

//Protected API endpoints
router.use(verifySession(), requiredSuperAdmin);

//GET
router.get("/me", superAdminController.getDataBySession);

//PATCH
router.patch(
  "/me",
  upload.single("profileDetails"),
  superAdminController.updateInformation
);

//DELETE
router.delete("/sign-out", authController.signOutUser);
module.exports = router;
