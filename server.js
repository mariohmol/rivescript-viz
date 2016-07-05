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

app.get('/topics', function (req, res) {
  console.log(bot._topics);
  res.json(bot._topics);
});

var port =3000;
app.listen(port);

var RiveScript = require('rivescript');
var bot = new RiveScript();

var loading_done = function (batch_num) {
    console.log("Batch #" + batch_num + " has finished loading!");
    bot.sortReplies(); // Now the replies must be sorted!
};
var loading_error = function(batch_num, error) {
    if(error) console.log("Error when loading files: " + error);
};

// Load a directory full of RiveScript documents (.rive files).
bot.loadDirectory("aiml/", loading_done, loading_error);
