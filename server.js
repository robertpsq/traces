const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


// Wasmer provides PORT automatically
const PORT = process.env.PORT || 3000;


// MySQL connection
const db = mysql.createConnection({
    host: "sql7.freesqldatabase.com",
    user: "sql7817130",
    password: "ppApLwfA9p",
    database: "sql7817130",
    port: 3306
});


db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to database");
    }
});

app.get("/", (req, res) => {
  res.send("Hello from Wasmer!");
});

app.listen(3000, () => console.log("Server started on port 3000"));

// Submit trace
app.post("/submit-trace", (req, res) => {

    const { badge_number, suspect_name, phone_number } = req.body;

    if (!badge_number || !suspect_name || !phone_number) {
        return res.status(400).send("Missing fields");
    }

    const sql = `
        INSERT INTO traces
        (badge_number, suspect_name, phone_number)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [badge_number, suspect_name, phone_number], (err) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        res.send("Trace saved");
    });
});


// Get traces
app.get("/get-traces", (req, res) => {

    const sql = `
        SELECT *
        FROM traces
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        res.json(results);
    });
});


// Start server
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});