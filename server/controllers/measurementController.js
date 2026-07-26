const db = require('../db');
const { createMeasurementSchema } = require('../validators/measurementValidator');

exports.create = async (req, res) => {
  try {
    const { error, value } = createMeasurementSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { deviceId, temperature, humidityAir, soilMoisture, illuminance } = value;
    const timestamp = req.body.timestamp || Date.now();

    const sql = `
      INSERT INTO measurements 
        (deviceId, timestamp, temperature, humidityAir, soilMoisture, illuminance)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await db.runAsync(sql, [
      deviceId, timestamp, temperature, humidityAir, soilMoisture, illuminance
    ]);

    res.status(201).json({
      message: 'Measurement saved',
      id: result.lastID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { deviceId, from, to, limit = 100, sort = 'desc' } = req.query;

    let where = [];
    let params = [];

    if (deviceId) {
      where.push('deviceId = ?');
      params.push(deviceId);
    }
    if (from) {
      where.push('timestamp >= ?');
      params.push(new Date(from).getTime());
    }
    if (to) {
      where.push('timestamp <= ?');
      params.push(new Date(to).getTime());
    }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const order = sort === 'asc' ? 'ASC' : 'DESC';
    const limitNum = parseInt(limit, 10);

    const sql = `
      SELECT * FROM measurements
      ${whereClause}
      ORDER BY timestamp ${order}
      LIMIT ?
    `;
    params.push(limitNum);

    const rows = await db.allAsync(sql, params);
    const result = rows.map(row => ({
      ...row,
      timestamp: new Date(row.timestamp).toISOString()
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLatest = async (req, res) => {
  try {
    const { deviceId } = req.query;
    let sql = 'SELECT * FROM measurements';
    let params = [];
    if (deviceId) {
      sql += ' WHERE deviceId = ?';
      params.push(deviceId);
    }
    sql += ' ORDER BY timestamp DESC LIMIT 1';

    const row = await db.getAsync(sql, params);
    if (!row) {
      return res.status(404).json({ error: 'No measurements found' });
    }
    row.timestamp = new Date(row.timestamp).toISOString();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM measurements WHERE id = ?';
    const result = await db.runAsync(sql, [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};