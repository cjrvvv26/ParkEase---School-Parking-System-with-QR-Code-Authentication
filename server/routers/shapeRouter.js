const router = require("express").Router();
const shapeController = require("../controllers/shapeController");
const verifyUser = require("../middlewares/verifyUser");
const requiredSuperAdmin = require("../middlewares/requiredSuperAdmin");

router.use(verifyUser(), requiredSuperAdmin);

router.get("/:id", shapeController.getShapeById);
router.get("/", shapeController.getAllShapes);
router.post("/", shapeController.saveMapLayout);
router.put("/", shapeController.updateMapLayout);

module.exports = router;
