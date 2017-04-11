var router = express.Router();

/* GET Signup page. */
router.post('/', function(req, res, next) {

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
