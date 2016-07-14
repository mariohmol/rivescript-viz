module.exports = function(app) {

    var fs = require('fs');

    app.get('/rivescriptviz', function(req, res) {
        res.render('/rivescriptviz/page.html');
    });

    app.get('/rivescriptviz/chat', function(req, res) {
        res.render('rivescriptviz/chat.html');
    });

    app.get('/rivescriptviz/interview', function(req, res) {
        res.render('rivescriptviz/interview.html');
    });

    app.get('/rivescriptviz/interviewedit', function(req, res) {
        res.render('rivescriptviz/interviewresults.html');
    });

    app.get('/rivescriptviz/graphs', function(req, res) {
        res.render('rivescriptviz/graphs.html');
    });

    app.get('/rivescriptviz/rive', function(req, res) {
        res.render('rivescriptviz/rive.html');
    });

    app.get('/rivescriptviz/topics', function(req, res) {
        console.log(app.bot._topics);
        res.json(app.bot._topics);
    });


    /**
    Converts a element like that:
    topic: '',value: 'Vamos começar novamente?\n<set met=false>What is your name?',delete: true,trigger: '*',goto: 'interview2' },

    In a rive topic

    trigger: 'What is your name?',
         reply: [Object],
         condition: [],
         redirect: null,
         previous: null
    */
    app.post('/rivescriptviz/topics', function(req, res) {

        var newtopics = {};
        for (var topic in req.body) {
            var item = req.body[topic];
            if (!newtopics[item.topic]) newtopics[item.topic] = [];


            if (item.goto && item.value) item.value += '{topic=' + item.goto + '}';
            if (item.goto && item.condition) item.condition += '{topic=' + item.goto + '}';

            var found=false;
            for(var t in newtopics[item.topic]){
              if(newtopics[item.topic][t].trigger==item.trigger){
                found=true;
                if(item.value) newtopics[item.topic][t].reply.push(item.value);
                if(item.condition) newtopics[item.topic][t].condition.push(item.condition);
              }
            }
            if(found) continue;

            var obj = {
                trigger: "",
                reply: [],
                condition: [],
                redirect: null,
                previous: null
            };
            obj.trigger = item.trigger;
            if(item.value) obj.reply.push(item.value);
            if(item.condition) obj.condition.push(item.condition);
            newtopics[item.topic].push(obj);
        }

        app.bot._topics = newtopics;
        var filename="all.rive";
        if(process.env.FINAL_RIVE_FILE) filename=process.env.FINAL_RIVE_FILE;
        var retorno = app.bot.write(filename);

        res.json({
            return: "ok",
            newtopics: newtopics
        });
    });

    app.get('/rivescriptviz/topics/spreadsheet', function(req, res) {
        var rivedata = app.bot.deparse();
        var topics = rivedata.topics;
        var returndata = [];
        var returntopics = {};

        for (var itemtopic in topics) {
            var topic = topics[itemtopic];
            returntopics[itemtopic] = itemtopic;
            for (var item in topic) {
                var newobj = {};
                newobj.topic = itemtopic;

                newobj.delete = true;
                newobj.trigger = topic[item].trigger;


                var tempNewObj,valTopics;

                newobj.condition = "";
                for (var c in topic[item].condition) {
                    tempNewObj = JSON.parse(JSON.stringify(newobj));
                    tempNewObj.condition = topic[item].condition[c];

                    valTopics = extractTopic(tempNewObj.condition);
                    if(valTopics){
                      tempNewObj.goto = valTopics.topic;
                      tempNewObj.condition= valTopics.cleantext;
                    }

                    returndata.push(tempNewObj);
                }

                newobj.value = "";
                for (var r in topic[item].reply) {
                    tempNewObj = JSON.parse(JSON.stringify(newobj));
                    tempNewObj.value = topic[item].reply[r];

                    valTopics = extractTopic(tempNewObj.value);
                    if(valTopics){
                      tempNewObj.goto = valTopics.topic;
                      tempNewObj.value= valTopics.cleantext;
                    }

                    returndata.push(tempNewObj);
                }

                if (topic[item].reply.length === 0 && topic[item].condition === 0) returndata.push(newobj);
            }
        }

        res.json({
            data: returndata,
            topics: returntopics,
            rivedata: rivedata
        });
    });

    app.get('/rivescriptviz/deparsed', function(req, res) {
        console.log(app.bot.deparse());
        res.json(app.bot.deparse());
    });

    app.get('/rivescriptviz/interviewresults', function(req, res) {
        var files = fs.readdirSync('./templates/results/');
        res.json({
            files: files
        });
    });

    app.get('/rivescriptviz/interviewresults/:name', function(req, res) {
        fs.readFile('./templates/results/' + req.params.name, 'utf8', function(err, data) {
            if (err) {
                res.json({
                    err: err
                });
            }
            res.json({
                data: data
            });
        });
    });

    app.post('/rivescriptviz/interviewresults/:name', function(req, res) {
        fs.writeFile('./templates/results/' + req.params.name, req.body.data, function(err) {
            if (err) {
                res.json({
                    err: err
                });
            }
            res.json({
                result: "OK"
            });
        });
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

    var extractTopic = function(text){
      var regexTopic = /{topic=(.*?)}/ig;
      //while (match = regexTopic.exec(newobj.value)) {
      match = regexTopic.exec(text);
      if(!match) return;
      return {"topic": match[1], "cleantext": text.replace(match[0], "")};
    };

};
