const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. Create (Register) User
exports.register = async (req, res) => {
    const { full_name, email, password, role, division, position } = req.body;

    try {
        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        // Hash the password for security
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insert user based on your schema
        const newUser = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, role, division, position) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, full_name, email, role`,
            [full_name, email, password_hash, role, division, position]
        );

        res.status(201).json({
            message: "User created successfully",
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error during registration");
    }
};

// 2. User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const user = result.rows[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                role: user.role // Important for Head of Dept access control
            }
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role, name: user.full_name });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error during login");
    }
};

// 3. Change Password (Logged-in users)
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // From auth middleware

    try {
        const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        // 1. Check if old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password incorrect" });
        }

        // 2. Hash and Save new password
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, userId]);

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// 4. Forgot Password (Reset via Email Logic)
// Note: For a real app, you'd send an email. Here we provide the logic to set a new one.
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [newHash, email]);

        res.json({ message: "Password reset successfully. You can now login." });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};