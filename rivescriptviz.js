module.exports = function(app){


  app.get('/rivescriptviz', function (req, res) {
     res.render('/rivescriptviz/page.html');
  });

  app.get('/rivescriptviz/chat', function (req, res) {
     res.render('rivescriptviz/chat.html');
  });

  app.get('/rivescriptviz/interview', function (req, res) {
     res.render('rivescriptviz/interview.html');
  });

  app.get('/rivescriptviz/graphs', function (req, res) {
     res.render('rivescriptviz/graphs.html');
  });

  app.get('/rivescriptviz/rive', function (req, res) {
     res.render('rivescriptviz/rive.html');
  });

  app.get('/rivescriptviz/topics', function (req, res) {
    console.log(app.bot._topics);
    res.json(app.bot._topics);
  });

  app.post('/rivescriptviz/topics', function (req, res) {
    console.log(res,req);
    for(var topic in app.bot._topics){
      console.log(topic);
    }
    res.json({return: "ok"});
  });

  app.get('/rivescriptviz/topics/spreadsheet', function (req, res) {

    var rivedata = app.bot.deparse();
    var topics = rivedata.topics;
    var returndata= [];
    var returntopics= {};

    for (var itemtopic in topics) {
        var topic = topics[itemtopic];
        returntopics[itemtopic]=itemtopic;
        for (var item in topic) {
            var newobj = {};
            newobj.topic = itemtopic;
            newobj.value = topic[item].reply[0];
            newobj.delete = true;
            newobj.trigger = topic[item].trigger;
            var regexTopic = /{topic=(.*?)}/ig;
            while (match = regexTopic.exec(newobj.value)) {
                newobj.goto = match[1];
                newobj.value = newobj.value.replace(match[0], "");
            }
            returndata.push(newobj);
        }
    }

    res.json({data: returndata, topics: returntopics});
  });

  app.get('/rivescriptviz/deparsed', function (req, res) {
    console.log(app.bot.deparse());
    res.json(app.bot.deparse());
  });

  app.get('/rivescriptviz/write', function (req, res) {
    var retorno = app.bot.write("test.rive");
    res.json({"return":retorno});
  });




  var port = 3000;
  var io = require('socket.io').listen(app.listen(port));

  var RiveScript = require('rivescript');
  app.bot = new RiveScript({
      utf8: true
  });

  var loading_done = function(batch_num) {
      console.log("Batch #" + batch_num + " has finished loading!");
      app.bot.sortReplies(); // Now the replies must be sorted!
  };
  var loading_error = function(batch_num, error) {
      console.log("Error when loading files: ", error, batch_num);
  };

  app.bot.loadDirectory("aiml/", loading_done, loading_error);

  var sendMessage = function(who, message) {
      var reply = app.bot.reply(who, message);
      var triggers;
      try {
          triggers = app.bot.getUserTopicTriggers(who);
      } catch (e) {
          console.log("getUserTopicTriggers");
          triggers = [];
      }
      var uservars = app.bot.getUservars(who);
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

};
