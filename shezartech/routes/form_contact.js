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
			db.getConnection(function (db) {
        		console.log("connected db from zalo contact page : ")

        		db.collection('zalo_contacts', function(err, collection) {
            		collection.find({list_id: list_id}).toArray(function(err, resulte) {

            			execPhp('messenger.php', (error, php, outprint) => { 

                		resulte.forEach(function (resulte,iop){
                			console.log("bhbhbhbhbhbhbh")
                			console.log(resulte)

		                    var result = resulte;   
		                    //var name = result.name;
		                    var phone = parseInt(result.phone);
		                    var oaid = '1032900368143269705';
		                    //var company = result.company;
		                    //var number = result.number;
		                    //var date = result.date;
		                    var timestamp = new Date().getTime();
		                    var secretkey = 'IEklE4N1I7bWqp5TOQ2F';
		                    //var data = '{"phone":'+phone+',"templateid":"'+templateid+'","templatedata":{"name":"'+name+'","company":"'+company+'","number":"'+number+'","date":"'+date+'"}}';
		                    
		                    var data = '{"phone":'+phone+',"templateid":"'+templateid+'","templatedata":{}}';

		                    console.log(data)

		                    // execPhp('messenger.php', (error, php, outprint) => { 

		                        php.my_function_zalo(oaid, data, timestamp, secretkey, (err, results, output, printed) => {
		                       
		                            var options = { method: 'POST',
		                                url: 'https://openapi.zaloapp.com/oa/v1/sendmessage/phone/cs',
		                                qs: { 
		                                    oaid: oaid,
		                                    data: data,
		                                    timestamp: timestamp,
		                                    mac: results
		                                },
		                                headers: { 
		                                    'cache-control': 'no-cache' 
		                                } 
		                            };

		                            request(options, function (error, response, body) {
		                              	if (error) throw new Error(error);
		                              	console.log(body);
		                              	body = JSON.parse(body)
		                                if(body.data) {
		                                	var msgid = body.body.msgId;
		                                    var insert_data = {templateid: templateid, phone:phone, time : timestamp, delivery_status : body.data.status, msgid : msgid }
		                                    db.collection('delivery_status').update({ fromuid:fromuid, msgid:msgid }, insert_data, { upsert : true });
		                                }
		                            });
		                        });
		                   	});
                		});
            		});
        		});

    		});
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
