var express = require('express');
var router = express.Router();
var busboy = require('connect-busboy');
const execPhp = require('exec-php');
var request = require('request');

/* GET Form Contact page. */
router.post('/', function (req, res, next) {

	console.log("comming")
	console.log(req.body)

	if(typeof req.body != 'undefined') {

		if(req.body.config_type == '1') {

			db.getConnection(function (db) {
			  	console.log("connected db from contact entry page : ")
			  	db.collection('zalo_contacts').insert(req.body)
			});
			res.send("contact data inserted successfully !!")
		}
		else if(req.body.config_type == '2') {
			res.send("csv data inserted successfully !!")
		}
		else if(req.body.config_type == '4') {
			var templateid = req.body.template_id;
			var list_id = parseInt(req.body.list_id)
			Utility.sendBroadcastMessege(templateid, list_id);
    		res.send("Broadcasting done successfully !!")
		}
		else {
			var multiparty = require('multiparty');
			var form = new multiparty.Form();
			var fs = require('fs');
			var Parse = require('csv-parse');

			form.parse(req, function(err, fields, files) { 
				var sourceFilePath = files.import_csv_contact[0].path
				var source = fs.createReadStream(sourceFilePath);
				var columns = true;
				var linesRead = 0;

			    var parser = Parse({
			        delimiter: ',', 
			        columns:columns
			    });

			    db.getConnection(function (db) {
			        var col = db.collection('zalo_contacts')
				    parser.on("readable", function(){
				        var record;
					        while (record = parser.read()) {
					            linesRead++;
					            console.log(record)
								col.insert(record)
					        }
				    });
				});

			    console.log("Total record :: "+linesRead)

			    parser.on("error", function(error){
			        console.log(error)
			    });

			    source.pipe(parser);
			});

			res.send("CSV data inserted successfully !!")
		}
	}
	else {
		res.send("no form data recieved");
	}
});

router.get('/', function (req, res, next) {

	console.log("himmmmmmmm")

	console.log(req.query.tmp_id)
	var templateid = req.query.tmp_id;

	db.getConnection(function (db) {

        db.collection('templates', function(err, collection) {
            collection.find({ zalo_template_id: templateid }).toArray(function(err, result) {
            	console.log(result[0].content)
            	res.send(result[0].content);
            })
        });
    })

	//var data = [];

	// async.series([
	//     function(callback) {
	//         // do some stuff ...
	//         callback(null, 'one');
	//     },
	//     function(callback) {
	//         // do some more stuff ...
	//         callback(null, 'two');
	//     }
	// ],
	// optional callback
	// function(err, results) {
	//     // results is now equal to ['one', 'two']
	// });

	//////////////////////////////////////////
			// db.getConnection(function (db) {
		 //        var col = db.collection('contacts')
			//     var cursor = col.find().forEach( function (myDoc) {
			//     	console.log(myDoc) 
			//     	data.push(myDoc)
			//     	console.log(data)
			//     });
			//     //console.log(data)
			// });
			// console.log(data)
			// res.send("csv")
	//////////////////////////////////////////
});

module.exports = router;
