const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');

router.post('/', measurementController.create);
router.get('/', measurementController.getAll);
router.get('/latest', measurementController.getLatest);
router.delete('/:id', measurementController.deleteById);

module.exports = router;