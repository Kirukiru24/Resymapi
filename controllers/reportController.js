const pool = require('../config/db');

exports.submitWeeklyReport = async (req, res) => {
    const client = await pool.connect();
    try {
        const { 
            start_date, 
            end_date, 
            challenges, 
            achievements, 
            future_plans, 
            tasks // Array of task objects
        } = req.body;
        
        const userId = req.user.id; // Obtained from Auth Middleware

        await client.query('BEGIN');

        // 1. Insert the main Weekly Report
        const reportResult = await client.query(
            `INSERT INTO weekly_reports 
            (user_id, start_date, end_date, challenges, achievements, future_plans, status, submitted_at) 
            VALUES ($1, $2, $3, $4, $5, $6, 'SUBMITTED', CURRENT_TIMESTAMP) 
            RETURNING id`,
            [userId, start_date, end_date, challenges, achievements, future_plans]
        );

        const reportId = reportResult.rows[0].id;

        // 2. Insert Tasks (Activities)
        const taskQuery = `
            INSERT INTO report_tasks (weekly_report_id, title, status, time_spent, notes) 
            VALUES ($1, $2, $3, $4, $5)
        `;

        for (const task of tasks) {
            await client.query(taskQuery, [
                reportId, 
                task.title,      // e.g., "Odoo Custom Help Desk" [cite: 19]
                task.status,     // e.g., "Completed" [cite: 20]
                task.time_spent, // e.g., "10 hr" [cite: 21]
                task.notes       // Detailed description [cite: 23]
            ]);
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Weekly report submitted successfully!", reportId });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Report Submission Error:", error.message);
        res.status(500).json({ error: "Failed to submit report. Please try again." });
    } finally {
        client.release();
    }
};

const pdfService = require('../utils/pdfGenerator');

exports.exportReportPDF = async (req, res) => {
    const { reportId } = req.params;

    try {
        // Fetch report data and join with user info
        const reportQuery = await pool.query(`
            SELECT wr.*, u.full_name, u.role, u.division 
            FROM weekly_reports wr 
            JOIN users u ON wr.user_id = u.id 
            WHERE wr.id = $1`, [reportId]);
        
        if (reportQuery.rows.length === 0) return res.status(404).send("Report not found");

        const tasksQuery = await pool.query(
            'SELECT * FROM report_tasks WHERE weekly_report_id = $1', 
            [reportId]
        );

        const pdfBuffer = await pdfService.generateWeeklyReportPDF(
            reportQuery.rows[0], 
            tasksQuery.rows
        );

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=Weekly_Report_${reportQuery.rows[0].full_name}.pdf`,
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating PDF");
    }
};

// Get all reports for the logged-in employee
exports.getMyReports = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware

        const query = `
            SELECT 
                wr.id, 
                wr.start_date, 
                wr.end_date, 
                wr.status, 
                wr.submitted_at,
                json_agg(rt.*) as tasks
            FROM weekly_reports wr
            LEFT JOIN report_tasks rt ON wr.id = rt.weekly_report_id
            WHERE wr.user_id = $1
            GROUP BY wr.id
            ORDER BY wr.submitted_at DESC;
        `;

        const result = await pool.query(query, [userId]);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching personal reports:", error.message);
        res.status(500).json({ error: "Failed to fetch your reports." });
    }
};



// controllers/reportController.js

exports.getAllReportsForHOD = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                wr.id, 
                wr.start_date, 
                wr.end_date, 
                wr.challenges, 
                wr.achievements, 
                wr.future_plans, 
                wr.additional_notes,
                u.full_name, 
                u.division, 
                u.position,
                u.email,
                -- This subquery fetches all tasks related to the report as a JSON array
                (
                    SELECT json_agg(tasks) 
                    FROM (
                        SELECT title, status, time_spent, notes 
                        FROM report_tasks 
                        WHERE weekly_report_id = wr.id
                    ) tasks
                ) as tasks
            FROM weekly_reports wr
            JOIN users u ON wr.user_id = u.id
            ORDER BY wr.submitted_at DESC;
        `);

        res.json(result.rows);
    } catch (err) {
        console.error("SQL Error:", err.message);
        res.status(500).send('Server Error');
    }
};