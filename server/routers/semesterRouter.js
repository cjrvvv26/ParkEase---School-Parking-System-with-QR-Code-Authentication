const router = require('express').Router();
const semesterController = require('../controllers/semesterController');
const verifyUser = require('../middlewares/verifyUser');
const requiredSuperAdmin = require('../middlewares/requiredSuperAdmin');

// Get current active semester
router.get('/current', semesterController.getCurrentSemester);

router.use(verifyUser(), requiredSuperAdmin);

// Create new semester (Super Admin only)
router.post('/', semesterController.createSemester);

// Get current and last semester revenue data
router.get('/revenue/dashboard', semesterController.getSemesterRevenueData);

// Get all semesters revenue for chart
router.get('/revenue/chart', semesterController.getSemesterRevenueChart);

// Get semester statistics for all semesters (Super Admin only)
router.get('/stats', semesterController.getSemesterStats);

// Get semester statistics (Super Admin only)
router.get('/stats/current', semesterController.getSemesterStats);

// Get all semesters (Super Admin only)
router.get('/', semesterController.getAllSemesters);

// Get semester by ID (Super Admin only)
router.get('/:id', semesterController.getSemesterById);

// Update semester (Super Admin only)
router.put('/:id', semesterController.updateSemester);

// Expire semester and reset students (Super Admin only)
router.patch('/:id/expire', semesterController.expireSemester);

module.exports = router;
