var utils = require('qlik-utils')

var requireDir = require('require-dir');
var dir = requireDir('init', {recurse: true});

var cors = require('cors')

var express = require('express');
var app = express();

app.use(cors());

var tasks = {}
app.get('/init', function(req, res) {

    var task = new utils.task();
    tasks[task.guid] = task;
    task.start();

    var ret = {};
    for (var key in dir) {
        if (dir.hasOwnProperty(key)) {
			
            var obj = dir[key];
            ret[key] = obj.index.init(req.query, req.headers);
			
        }
    }

    utils.task.all(ret).then(function(retVal) {
		
		var count = {
			running: 0,
			failed: 0,
			done: 0
		};
		
		for (var key in retVal) {
			if (retVal.hasOwnProperty(key)) {
				if(typeof count[retVal[key].status] == 'undefined') count[retVal[key].status] = 0;
				count[retVal[key].status]++;
			}
		}
		
		if(count.failed != 0) task.failed(retVal);
		else if(count.running != 0) task.running(retVal);
		else if(count.done != 0) task.done(retVal);

        res.send(task);

    }, function(retVal) {

        res.status(500).send(retVal);

    })

});

app.get('/getProgress', function(req, res) {

    var guid = req.query.guid;
    var task = tasks[guid];

    if(typeof task == 'undefined')
        res.status(500).send('Unknown task');
    else {

		utils.task.all(task.val).then(function(retVal) {
			
			var count = {
				running: 0,
				failed: 0,
				done: 0
			};
			
			for (var key in retVal) {
				if (retVal.hasOwnProperty(key)) {
					if(typeof count[retVal[key].status] == 'undefined') count[retVal[key].status] = 0;
					count[retVal[key].status]++;
				}
			}
			
			if(count.failed != 0) task.failed(retVal);
			else if(count.running != 0) task.running(retVal);
			else if(count.done != 0) task.done(retVal);

			res.send(task);

		}, function(retVal) {

			res.status(500).send(retVal);

		})

    }

});

var server = app.listen(11337, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('listening at %s:%s', host, port);
})

