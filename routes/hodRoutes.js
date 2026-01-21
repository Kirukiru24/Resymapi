const express = require('express');
const router = express.Router();
const hodController = require('../controllers/hodController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Protect all HOD routes with auth and DEPT_HEAD role check
router.get('/reports', auth, roleCheck('DEPT_HEAD'), hodController.getAllEmployeeReports);
router.get('/missing', auth, roleCheck('DEPT_HEAD'), hodController.getMissingReports);

module.exports = router;