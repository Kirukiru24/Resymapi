const pool = require('../config/db');

exports.getMyNotifications = async (req, res) => {
    try {
        // req.user.id comes from your 'auth' middleware
        const result = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};