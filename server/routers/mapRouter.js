const express = require("express");
const router = express.Router();
const mapController = require("../controllers/mapController");
const verifyUser = require("../middlewares/verifyUser");
const requiredSuperAdmin = require("../middlewares/requiredSuperAdmin");

router.use(verifyUser(), requiredSuperAdmin);

router.post("/", mapController.createMap);
router.get("/", mapController.getAllMaps);
router.get("/:id", mapController.getMapById);
router.put("/:id", mapController.updateMap);
router.delete("/:id", mapController.deleteMap);

module.exports = router;
