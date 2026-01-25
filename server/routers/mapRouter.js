const express = require("express");
const router = express.Router();
const mapController = require("../controllers/mapController");
const verifyUser = require("../middlewares/verifyUser");
const requiredSuperAdmin = require("../middlewares/requiredSuperAdmin");
const upload = require("../middlewares/uploadImage");

router.use(verifyUser(), requiredSuperAdmin);

router.get("/with-shapes", mapController.getAllMapsWithShapes);
router.post("/", upload.any(), mapController.createMap);
router.get("/", mapController.getAllMaps);
router.get("/:id", mapController.getMapById);
router.put("/:id", mapController.updateMap);
router.delete("/:id", mapController.deleteMap);

module.exports = router;
