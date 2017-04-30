var express = require('express');
var router = express.Router();

/* GET main page page. */
router.get('/', function(req, res, next) {
	res.send('respond with a resourceaaaa');
});

module.exports = router;