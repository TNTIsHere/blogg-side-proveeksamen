const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./proveeksamen-april-firebase-adminsdk-bg6te-b10cae244e.json');
const isAuthenticated = require('./auth.js');

const exapp = express();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exapp.set('view engine', 'ejs');
exapp.set('views', path.join(__dirname, 'views'));
exapp.use(express.static('public'));

// Add the middleware to secure the routes
exapp.use('/veiledning', isAuthenticated);

// Import and use the routes
const routes = require('./routes');
exapp.use('/', routes);

exapp.get('/', function(req, res) {
    console.log('index route called');
    res.render('index', { title: 'Blog Site' });
});

exapp.get('/troll', function(req, res) {
  res.render('troll', { title: 'Blog Site' });
});

exapp.get('/haroba', function(req, res) {
  res.render('haroba', { title: 'Blog Site' });
});

exapp.listen(3000, function() {
    console.log('Listening on port 3000');
});