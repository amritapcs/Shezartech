var express = require('express');
var router = express.Router();

/* GET Signup page. */
router.get('/', function(req, res, next) {
	res.render('main_page', { title: 'Main_page' });
});

module.exports = router;