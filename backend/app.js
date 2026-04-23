const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",          // Your MySQL username
    password: "",          // Your MySQL password
    database: "text_app"   // Database we created
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("Database connection has failed:", err);
    } else {
        console.log("Connected to database: text_app");
    }
});

// Create table if it doesn't exist
const createTableQuery = `
CREATE TABLE IF NOT EXISTS texts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
db.query(createTableQuery, (err) => {
    if (err) console.error("Error creating table:", err);
});

// Endpoint to submit text
app.post("/submit-text", (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.json({ success: false, message: "Text cannot be empty" });
    }

    const query = "INSERT INTO texts (content) VALUES (?)";
    db.query(query, [text], (err, result) => {
        if (err) {
            console.error("Error saving text:", err);
            return res.json({ success: false, message: "Has failed to save text" });
        }
        res.json({ success: true, message: "Text saved successfully!" });
    });
});

// Endpoint to get all texts
app.get("/texts", (req, res) => {
    db.query("SELECT * FROM texts ORDER BY id DESC", (err, results) => {
        if (err) {
            console.error("Error fetching texts:", err);
            return res.json([]);
        }
        res.json(results);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
