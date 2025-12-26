const router = require("express").Router();
const slotController = require("../controllers/slotController");
const verifyUser = require("../middlewares/verifyUser");

router.get("/", slotController.getAllSlots);

router.post("/", slotController.registerStudentSlot);

router.patch("/scan", slotController.updateSlotOccupancy);

router.patch("/remove", slotController.removeSlotExclusiveness);

module.exports = router;
