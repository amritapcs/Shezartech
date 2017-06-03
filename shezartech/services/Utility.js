const execPhp = require('exec-php');
var request = require('request');

module.exports = {

	sendBroadcastMessege : function(templateid, list_id){
		db.getConnection(function (db) {
    		console.log("connected db from zalo sendBroadcastMessege page : ")

    		console.log("templateid ::: "+typeof(templateid))
    		console.log("list_id ::: "+typeof(list_id))

    		db.collection('zalo_contacts', function(err, collection) {
        		collection.find({list_id: list_id}).toArray(function(err, resulte) {

        			console.log(resulte)

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
	                                	var msgid = body.data.msgId;
	                                	console.log("msgid is :: "+msgid)
	                                    var insert_data = {templateid: templateid, phone:phone, time : timestamp, delivery_status : body.data.status, msgid : msgid }
	                                    db.collection('delivery_status').insert(insert_data);
	                                }
	                            });
	                        });
	                   	});
            		});
        		});
    		});

		});
	},

	requeueData : function (scheduling_type, interval, scheduling_slot_time, ts, templateid, list_id, callback ) {

		var self = this;
		var server_timestamp = new Date();
		console.log("server_timestamp ::: "+server_timestamp)
	    var server_unixtime = server_timestamp.getTime();
	    console.log("server_unixtime ::: "+server_unixtime)
	    var standard_unixtime = server_unixtime -7200000;
	    console.log("standard_unixtime ::: "+standard_unixtime)
	                
	    var zone = moment.tz.zone('Asia/Kolkata');
	    console.log(zone)
	    var offset = zone.offset(moment().valueOf());
	    console.log("offset ::: "+offset)
	                      
	    var client_unixtime = standard_unixtime + (-1 * offset *60000);
	    if(ts) {
	    	console.log("comming in ts parts............"+ts)
	    	client_unixtime = ts;
	    }
	    var client_date = new Date(client_unixtime);
	    console.log("client_date ::: "+client_date)

	    var dates = client_date.getFullYear()+"-"+("0" + (client_date.getMonth()+1)).slice(-2) +"-"+("0" + client_date.getDate()).slice(-2);
	    console.log("data is ::: "+dates+" "+scheduling_slot_time)
	    var cron_date = moment.tz(dates+" "+scheduling_slot_time, 'Asia/Kolkata');
		cron_date = cron_date.toDate();
	    console.log(cron_date);
	    var cron_time = cron_date.getTime();
	    console.log("ts ::: "+cron_time)

	    var tdate = new Date().setHours(0,0,0,0);
	    var date = new Date();

	    if(interval == undefined || interval == "daily") {
	        var interval_delay = 86400000;
	    }
	    else if(interval == "weekly") {

	        var day = date.getDay();
	        var diff = date.getDate() - day + (day == 0 ? -6:1);
	        var firstDay = new Date(date.setDate(diff+7));
	        firstDay = firstDay.setHours(0,0,0,0);
	        var interval_delay = (parseInt(firstDay)-parseInt(tdate));
	    }
	    else if(interval == "monthly") {
	        var firstDay = new Date(date.getFullYear(), date.getMonth()+1, 1);
	        firstDay = firstDay.setHours(0,0,0,0);
	        var interval_delay = (parseInt(firstDay)-parseInt(tdate));
	    }             

	    var delay_seconds = (cron_time - server_unixtime > 0) ? (cron_time - server_unixtime)/1000 : ((cron_time - server_unixtime) + interval_delay)/1000
	    
	    while(delay_seconds < -(interval_delay/1000)){
	    	console.log("lklk")
	        cron_time  += interval_delay;
	        delay_seconds = (cron_time - server_unixtime > 0) ? (cron_time - server_unixtime)/1000 : ((cron_time - server_unixtime) + interval_delay)/1000
	    }

	    cron_time  = cron_time + interval_delay;

	    console.log("cron_time ::: "+cron_time)

	    var queue_data = { scheduling_type : scheduling_type, interval : interval, scheduling_slot_time : scheduling_slot_time, templateid : templateid, list_id : list_id, ts : parseInt(cron_time) };

	    self.insertInQueue(queue_data, callback);

	},

	insertInQueue : function (queue_data, callback) {
		db.getConnection(function (db) {
		  	console.log("connected db from queue entry page : ")
		  	db.collection('queue').insert(queue_data);
		  	callback("inserted successfully in queue...")
		});
	}
};