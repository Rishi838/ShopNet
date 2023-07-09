const express = require('express');
const router = express.Router();
const middleware = require('../utilities/middleware');

router.post('/protected', middleware, (req, res) => {
  // Access the authenticated user through req.user
  const user = req.user;
  // Handle protected route logic
  res.status(200).json({ message: 'Protected route accessed successfully', user });
});

module.exports = router;