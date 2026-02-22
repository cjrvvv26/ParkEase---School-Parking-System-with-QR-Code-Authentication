const router = require("express").Router();
const semesterController = require("../controllers/semesterController");
const verifyUser = require("../middlewares/verifyUser");
const requiredSuperAdmin = require("../middlewares/requiredSuperAdmin");

router.use(verifyUser(), requiredSuperAdmin);

// Create new semester (Super Admin only)
router.post("/", semesterController.createSemester);

// Get current active semester
router.get("/current", semesterController.getCurrentSemester);

// Get semester statistics (Super Admin only)
router.get("/stats/current", semesterController.getSemesterStats);

// Get all semesters (Super Admin only)
router.get("/", semesterController.getAllSemesters);

// Get semester by ID (Super Admin only)
router.get("/:id", semesterController.getSemesterById);

// Update semester (Super Admin only)
router.put("/:id", semesterController.updateSemester);

// Expire semester and reset students (Super Admin only)
router.patch("/:id/expire", semesterController.expireSemester);

module.exports = router;
