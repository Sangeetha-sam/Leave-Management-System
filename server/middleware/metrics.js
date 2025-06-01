// server/middleware/metrics.js
import express from 'express';
import client from 'prom-client';

const router = express.Router();

// Enable default metrics collection
client.collectDefaultMetrics();

router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

export default router;
