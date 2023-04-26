const express = require('express');
const path = require('path');
const exapp = express();
exapp.set('view engine', 'ejs');
exapp.set('views', path.join(__dirname, 'views'));
exapp.use(express.static('public'));

exapp.get('/', function(req, res) {
    res.render('index', { title: 'Blog Site' });
});

exapp.get('/troll', function(req, res) {
    res.render('troll', { title: 'Blog Site' });
});

exapp.get('/haroba', function(req, res) {
  res.render('haroba', { title: 'Blog Site' });
});

exapp.get('/veiledning', function(req, res) {
  res.render('veiledning', { title: 'Blog Site' });
});

exapp.listen(3000, function() {
    console.log('Server listening on http://localhost:3000');
});
