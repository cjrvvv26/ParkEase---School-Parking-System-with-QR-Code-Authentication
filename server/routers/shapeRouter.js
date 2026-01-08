const router = require("express").Router();
const shapeController = require("../controllers/shapeController");

router.get("/", shapeController.getAllShapes);
router.post("/", shapeController.createShape);
router.put("/", shapeController.updateMapLayout);

module.exports = router;
