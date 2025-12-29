const router = require("express").Router();
const verifySession = require("../middlewares/verifyUser");
const requiredSuperAdmin = require("../middlewares/requiredSuperAdmin");
const superAdminController = require("../controllers/superAdminController");

//Protected API endpoints
router.use(verifySession(), requiredSuperAdmin);

router.get("/me", superAdminController.getDataBySession);

module.exports = router;
