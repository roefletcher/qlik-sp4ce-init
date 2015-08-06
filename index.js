var requireDir = require('require-dir');
var dir = requireDir('init', {recurse: true});

var express = require('express');
var app = express();

app.get('/init', function(req, res) {

    var ret = [];
    for (var key in dir) {
        if (dir.hasOwnProperty(key)) {
            var obj = dir[key];
            ret.push(obj.index.init(req.query, req.headers));
        }
    }

    Promise.all(ret).then(function(retVal) {
        res.send(retVal);
    }, function(retVal) {
        res.status(500).send(retVal);
    })

});

var server = app.listen(11337, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('listening at %s:%s', host, port);
})

