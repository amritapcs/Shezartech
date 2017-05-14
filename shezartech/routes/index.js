var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	db.getConnection(function (db) {
        //console.log("connected db from zalo contact page : ")

        db.collection('templates', function(err, collection) {
            collection.find().toArray(function(err, result1) {
            	//console.log(result1)
            	db.collection('lists', function(err, collection) {
		            collection.find().toArray(function(err, result2) {
		            	//console.log(result2)
		            	res.render('index_main', { title: 'Express',templates: result1, lists: result2 });
		            });
		        });
            });
        });

        // db.collection('lists', function(err, collection) {
        //     collection.find().toArray(function(err, result2) {
        //     	console.log(result2)
        //     });
        // });
    });

  // res.render('index_main', { title: 'Express' });
});

module.exports = router;
