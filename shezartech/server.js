var fs = require('fs');
var express = require('express');
var app = express();
var https = require('https');

var options = {
    key: fs.readFileSync('/var/www/botshezar.com/botshezar.com.key'),
    cert: fs.readFileSync('/var/www/botshezar.com/219c087d9f98a683.crt')
};
var server = https.createServer(options, app);
var builder = require('botbuilder');

server.listen(process.env.port || process.env.PORT || 3000, function () {
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
      }
      else if(session.message.text.toLowerCase().contains('hi')){
        session.send(`Hello.. How can I help you?`);
      }
      else if(session.message.text.toLowerCase().contains('help')){
        session.send(`How can I help you?`);
      }
      else if(session.message.text.toLowerCase().contains('From where can I get a return form?')) {
        session.send(`The return form can be downloaded from the site http://www.incometaxindia.gov.in or http://incometaxindiaefiling.gov.in`);
      }
      else if(session.message.text.toLowerCase().contains('Is there any e-filling help desk established by the Income-tax Departement?')) {
        session.send(`​​In case of queries on e-filing of return, the taxpayer can contact 1800 4250 0025.`);
      }
      else if(session.message.text.toLowerCase().contains('Who can use ITR-1 (Sahaj) ?')) {
        session.send(`For Individuals having Income from Salaries, one house property, other sources (Interest etc.) and having total income upto Rs.50 lakh`);
      }
      else if(session.message.text.toLowerCase().contains('Who can use ITR-2 ?')) {
        session.send(`For Individuals not carrying out business or profession under any proprietorship;`);
      }
      else if(session.message.text.toLowerCase().contains('Who can use ITR-3 ?')) {
        session.send(`For individuals having income from a proprietary business or profession.`);
      }
      else if(session.message.text.toLowerCase().contains('Who cannot use ITR-3? ')) {
        session.send(`​​Form ITR – 3 cannot be used by any person other than an individual or a HUF. Further, an individual or a HUF not having income from business or profession cannot use ITR – 3`);
      }
      else{
        session.send(`sorry, I didn't understand you`);
      }
});