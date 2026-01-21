const cron = require('node-cron');
const pool = require('../config/db');

// Runs every Sunday at 8:00 PM (0 20 * * 0)
cron.schedule('0 20 * * 0', async () => {
    console.log('Running Sunday Deadline Check...');
    try {
        const missingQuery = `
            SELECT id FROM users 
            WHERE role = 'EMPLOYEE' AND is_active = true
            AND id NOT IN (
                SELECT user_id FROM weekly_reports 
                WHERE start_date >= CURRENT_DATE - INTERVAL '6 days'
            );
        `;
        const missingUsers = await pool.query(missingQuery);

        for (const user of missingUsers.rows) {
            await pool.query(
                `INSERT INTO notifications (user_id, message, type) 
                 VALUES ($1, $2, $3)`,
                [user.id, "Missing Weekly Report: Please submit your report before Monday morning.", "WARNING"]
            );
        }
        console.log(`Warnings sent to ${missingUsers.rowCount} users.`);
    } catch (err) {
        console.error('Cron Job Error:', err.message);
    }
});