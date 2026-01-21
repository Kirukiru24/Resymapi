const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// This matches /api/notifications/my-notifications
router.get('/my-notifications', auth, notificationController.getMyNotifications);

module.exports = router;