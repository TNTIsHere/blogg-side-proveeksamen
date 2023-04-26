const express = require('express');
const router = express.Router();

const isAuthenticated = require('./auth.js');

router.get('/veiledning', isAuthenticated, (req, res) => {
    console.log('veiledning route called');
    res.send(`Hello ${req.user.name}! This is a protected route.`);
  });

module.exports = router;