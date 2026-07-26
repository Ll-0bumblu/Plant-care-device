require('dotenv').config();
const express = require('express');
const cors = require('cors');
const measurementRoutes = require('./routes/measurementRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'

app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/measurements', measurementRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Swagger UI доступен по адресу http://localhost:${PORT}/api-docs`);
});