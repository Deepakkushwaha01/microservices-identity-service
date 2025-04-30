import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the identity service!');
});

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

export default router;