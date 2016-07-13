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
app.use(bodyParser.text({ type: 'text/html' }));

app.get('/', function (req, res) {
   res.render('page.html');
});

require('./rivescriptviz')(app);
