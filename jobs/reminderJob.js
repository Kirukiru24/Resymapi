const cron = require('node-cron');
const pool = require('../config/db');

/**
 * Sunday Deadline Check
 * Trigger: Every Sunday at 8:00 PM (20:00) Ethiopia Time
 */
cron.schedule('0 20 * * 0', async () => {
    const now = new Date();
    console.log('--- Sunday Deadline Check Initialized ---');
    console.log(`Server Time (UTC): ${now.toISOString()}`);
    console.log(`Local Time (EAT): ${now.toLocaleString('en-GB', { timeZone: 'Africa/Addis_Ababa' })}`);

    try {
        // Query to find active employees who haven't submitted a report in the last 6 days
        const missingQuery = `
            SELECT id, full_name FROM users 
            WHERE role = 'EMPLOYEE' AND is_active = true
            AND id NOT IN (
                SELECT user_id FROM weekly_reports 
                WHERE start_date >= CURRENT_DATE - INTERVAL '6 days'
            );
        `;
        
        const missingUsers = await pool.query(missingQuery);

        if (missingUsers.rows.length === 0) {
            console.log('All employees have submitted their reports. No warnings sent.');
            return;
        }

        // Loop through missing users and insert a warning notification
        for (const user of missingUsers.rows) {
            await pool.query(
                `INSERT INTO notifications (user_id, message, type) 
                 VALUES ($1, $2, $3)`,
                [
                    user.id, 
                    "Missing Weekly Report: Please submit your report before Monday morning to avoid late status.", 
                    "WARNING"
                ]
            );
        }

        console.log(`Successfully sent warnings to ${missingUsers.rowCount} users.`);
        
    } catch (err) {
        console.error('CRON JOB ERROR:', err.message);
    } finally {
        console.log('--- Sunday Deadline Check Completed ---');
    }
}, {
    scheduled: true,
    timezone: "Africa/Addis_Ababa"
});