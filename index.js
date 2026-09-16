require('dotenv').config();
const express = require('express');
const db = require('./db'); // pool de conexión

const app = express();
app.use(express.json()); // reemplaza a body-parser

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

// CREATE
app.post('/productos', async (req, res) => {
  try {
    const { nombre, categoria, descripcion, garantia, precio, stock } = req.body;

    if (!nombre || !categoria || precio === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, categoría y precio son obligatorios'
      });
    }

    const sql = `
      INSERT INTO productos (nombre, categoria, descripcion, garantia, precio, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [nombre, categoria, descripcion, garantia, precio, stock]);

    res.status(201).json({
      success: true,
      message: 'Producto registrado correctamente',
      id: result.insertId
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ - listar todos
app.get('/productos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows); // antes: res.json({ success: true, data: rows })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// SEARCH - por id
app.get('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json(rows[0]); // antes: res.json({ success: true, data: rows[0] })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE
app.put('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, descripcion, garantia, precio, stock } = req.body;

    if (!nombre || !categoria || precio === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, categoría y precio son obligatorios'
      });
    }

    const sql = `
      UPDATE productos
      SET nombre = ?, categoria = ?, descripcion = ?, garantia = ?, precio = ?, stock = ?, update_at = NOW()
      WHERE id = ?
    `;
    const [result] = await db.query(sql, [nombre, categoria, descripcion, garantia, precio, stock, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    res.json({ success: true, message: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE
app.delete('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});