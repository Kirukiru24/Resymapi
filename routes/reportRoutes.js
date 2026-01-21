const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth'); // Your JWT verifier
const roleCheck = require('../middleware/roleCheck');

/**
 * @route   POST /api/reports/submit
 * @desc    Submit a weekly report with activities
 * @access  Private (Employee)
 */
router.post('/submit', auth, reportController.submitWeeklyReport);
// Add to reportRoutes.js
router.get('/export/:reportId', auth, roleCheck('DEPT_HEAD'), reportController.exportReportPDF);
/**
 * @route   GET /api/reports/hod/reports
 * @desc    Get all reports (for Department Heads/Admin)
 * @access  Private (Admin)
 */
router.get('/hod/reports', auth, roleCheck('DEPT_HEAD'), reportController.getAllReportsForHOD);
module.exports = router;

/**
 * @route   GET /api/reports/my-reports
 * @desc    Get all reports submitted by the logged-in user
 * @access  Private (Employee)
 */
router.get('/my-reports', auth, reportController.getMyReports);