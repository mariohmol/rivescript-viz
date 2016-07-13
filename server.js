var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('view engine', 'html');
app.set('views', __dirname + '/templates');
app.engine('html', require('ejs').renderFile);

app.use('/node_modules',express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
   res.render('page.html');
});

app.get('/chat', function (req, res) {
   res.render('chat.html');
});

app.get('/interview', function (req, res) {
   res.render('interview.html');
});

app.get('/graphs', function (req, res) {
   res.render('graphs.html');
});

app.get('/rive', function (req, res) {
   res.render('rive.html');
});

app.get('/topics', function (req, res) {
  console.log(bot._topics);
  res.json(bot._topics);
});
/*
app.put('/topics', function (req, res) {

  for(topic in bot._topics){

  }
  res.json({return: "ok"});
});

app.post('/topics', function (req, res) {
  for(topic in bot._topics){

  }
  res.json({return: "ok"});
});

app.delete('/topics', function (req, res) {
  for(topic in bot._topics){

  }
  res.json({return: "ok"});
});
*/
app.get('/deparsed', function (req, res) {
  console.log(bot.deparse());
  res.json(bot.deparse());
});

app.get('/write', function (req, res) {
  var retorno = bot.write("test.rive");
  res.json({"return":retorno});
});

var port = 3000;
var io = require('socket.io').listen(app.listen(port));

var RiveScript = require('rivescript');
var bot = new RiveScript({
    utf8: true
});

var loading_done = function(batch_num) {
    console.log("Batch #" + batch_num + " has finished loading!");
    bot.sortReplies(); // Now the replies must be sorted!
};
var loading_error = function(batch_num, error) {
    console.log("Error when loading files: ", error, batch_num);
};

bot.loadDirectory("aiml/", loading_done, loading_error);

var sendMessage = function(who, message) {
    var reply = bot.reply(who, message);
    var triggers;
    try {
        triggers = bot.getUserTopicTriggers(who);
    } catch (e) {
        console.log("getUserTopicTriggers");
        triggers = [];
    }
    var uservars = bot.getUservars(who);
    var resposta = {
        message: reply,
        triggers: triggers,
        uservars: uservars
    };
    io.sockets.emit('message', resposta);
};

io.sockets.on('connection', function(socket) {
    socket.on('send', function(data) {
        console.log(data);
        sendMessage(data.who, data.message);
    });
});
