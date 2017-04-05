var express = require('express');
var router = express.Router();

/* GET Signup page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login Form' });
});

module.exports = router;
