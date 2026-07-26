const sqlite3 = require('sqlite3');
const { promisify } = require('util');
const path = require('path');

const db = new sqlite3.Database(
  process.env.DB_PATH || path.join(__dirname, 'sensor_data.db'),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) console.error('Ошибка открытия БД:', err.message);
    else console.log('Подключено к SQLite');
  }
);

db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));

db.runAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS measurements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deviceId TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    temperature REAL NOT NULL,
    humidityAir REAL NOT NULL,
    soilMoisture REAL NOT NULL,
    illuminance REAL NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_device_timestamp 
    ON measurements (deviceId, timestamp DESC);
`;

db.exec(createTableSQL, (err) => {
  if (err) {
    console.error('Ошибка создания таблицы:', err.message);
  } else {
    console.log('Таблица measurements готова');
  }
});

module.exports = db;