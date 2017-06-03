// var restify = require('restify');
// var builder = require('botbuilder');

// // Setup Restify Server
// var server = restify.createServer();
// server.listen(process.env.port || process.env.PORT || 3978, function () {
//    console.log('%s listening to %s', server.name, server.url); 
// });

// // Create chat connector for communicating with the Bot Framework Service
// var connector = new builder.ChatConnector({
//     appId: '6a5782d3-6bae-4d63-a4b4-5129d03110e1',
//     appPassword: '2952NMqcdJ8oZX3XOQ0hycj'
// });

// // Listen for messages from users 
// server.post('/api/messages', connector.listen());

// // Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
// var bot = new builder.UniversalBot(connector, function (session) {
//     session.send("You said: %s", "yes it's himanshu");
// });



var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
//https.globalAgent.maxSockets = Infinity;
var options = {
    key: fs.readFileSync('/var/www/botshezar.com/botshezar.com.key'),
    cert: fs.readFileSync('/var/www/botshezar.com/219c087d9f98a683.crt')
};
var server = https.createServer(options, app);
//var server = http.createServer(app);


//var restify = require('restify');
///// comment //////
console.log("himanshu yadav")
var builder = require('botbuilder');

//var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: '6a5782d3-6bae-4d63-a4b4-5129d03110e1',
    appPassword: '2952NMqcdJ8oZX3XOQ0hycj'
});
var bot = new builder.UniversalBot(connector);
app.post('/api/messages', connector.listen());

bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});
bot.on('typing', function (message) {
	console.log("user is typing....");
});
bot.on('deleteUserData', function (message) {
    // User asked to delete their data
});
//=========================================================
// Bots Dialogs
//=========================================================
String.prototype.contains = function(content){
  return this.indexOf(content) !== -1;
}
bot.dialog('/', function (session) {
    if(session.message.text.toLowerCase().contains('hello')){
      session.send(`Hey, How are you?`);
      }else if(session.message.text.toLowerCase().contains('help')){
        session.send(`How can I help you?`);
      }else{
        session.send(`Sorry I don't understand you...`);
      }
});