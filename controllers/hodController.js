const pool = require('../config/db');

// 1. Get all reports for the dashboard
exports.getAllEmployeeReports = async (req, res) => {
    try {
        const query = `
            SELECT 
                wr.id, 
                u.full_name, 
                u.division, 
                wr.start_date, 
                wr.end_date, 
                wr.status, 
                wr.submitted_at
            FROM weekly_reports wr
            JOIN users u ON wr.user_id = u.id
            ORDER BY wr.submitted_at DESC;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error fetching dashboard data" });
    }
};

// 2. Identify employees who haven't submitted this week
exports.getMissingReports = async (req, res) => {
    try {
        const query = `
            SELECT id, full_name, email, division 
            FROM users 
            WHERE role != 'DEPT_HEAD' AND is_active = true
            AND id NOT IN (
                SELECT user_id FROM weekly_reports 
                WHERE start_date >= CURRENT_DATE - INTERVAL '7 days'
            );
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error identifying missing reports" });
    }
};