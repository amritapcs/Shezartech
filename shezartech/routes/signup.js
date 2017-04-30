var express = require('express');
var router = express.Router();

/* GET Signup page. */
router.get('/', function (req, res, next) {
	res.render('login', { title: 'Login Form' });
});

router.post('/', function (req, res, next) {
	console.log("jjjjjjj")

  	db.getConnection(function (db) {
	  console.log("connected db from signup page : ")

	  var username = req.body.username;
	  var password = req.body.password;
	  var email = req.body.email;

	  var insert_data = { "username" : username , "password" : password , "email" : email };

	  console.log(insert_data)

	  db.collection('user').insert(insert_data)

	});

  res.send("signup successfully...")
});

module.exports = router;
