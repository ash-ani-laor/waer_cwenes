// server/server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./divination_history.db");

db.serialize(() => {
  // Удаляем старую таблицу (если нужно сохранить данные, сделай бэкап)
  db.run("DROP TABLE IF EXISTS divinations");
  db.run(`
    CREATE TABLE IF NOT EXISTS divinations (
      question TEXT,
      questionFixedTime TEXT,
      layout TEXT,
      tags TEXT,
      timestamp TEXT,
      groups TEXT,
      title TEXT,
      previewImage TEXT,
      PRIMARY KEY (question, questionFixedTime) -- ← Составной ключ
    )
  `);
});

app.post("/api/divinations", (req, res) => {
  const {
    question,
    layout,
    tags,
    timestamp,
    groups,
    questionFixedTime,
    title,
    previewImage,
  } = req.body;
  console.log("Received divination:", {
    question,
    layout,
    tags,
    timestamp,
    groups,
    questionFixedTime,
    title,
    previewImage,
  });

  const layoutJson = JSON.stringify(layout);
  const tagsJson = JSON.stringify(tags || []);
  const groupsJson = JSON.stringify(groups || []);
  const saveTimestamp = timestamp || new Date().toISOString();

  const stmt = db.prepare(
    "INSERT OR REPLACE INTO divinations (question, questionFixedTime, layout, tags, timestamp, groups, title, previewImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  stmt.run(
    question,
    questionFixedTime,
    layoutJson,
    tagsJson,
    saveTimestamp,
    groupsJson,
    title,
    previewImage,
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ question, questionFixedTime, timestamp: saveTimestamp });
    }
  );
  stmt.finalize();
});

app.get("/api/divinations", (req, res) => {
  const stmt = db.prepare("SELECT * FROM divinations");
  stmt.all([], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(
      rows.map((row) => ({
        ...row,
        layout: JSON.parse(row.layout),
        tags: JSON.parse(row.tags),
        groups: JSON.parse(row.groups || "[]"),
        questionFixedTime: row.questionFixedTime,
        previewImage: row.previewImage,
      }))
    );
  });
  stmt.finalize();
});

app.delete("/api/divinations/:timestamp", (req, res) => {
  const { timestamp } = req.params;
  console.log("Deleting record with timestamp:", timestamp);
  const stmt = db.prepare("DELETE FROM divinations WHERE timestamp = ?");
  stmt.run(timestamp, (err) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("Deleted record with timestamp:", timestamp);
    res.json({ success: true });
  });
  stmt.finalize();
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
