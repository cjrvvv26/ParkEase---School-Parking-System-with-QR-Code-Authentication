const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyUser = require("../middlewares/verifyUser");
const requiredSuperAdmin = require("../middlewares/requiredSuperAdmin");

router.use(verifyUser(), requiredSuperAdmin);

router.get("/", userController.getAllUsers);
router.post("/available", userController.getAvailableUsers);

module.exports = router;
