require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.get("/registros", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM registros ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/registros", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const result = await pool.query(
      "INSERT INTO registros (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});