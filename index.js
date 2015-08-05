var express = require('express');
var utils = require('qlik-utils');
var promise = require('promise');
var fs = require('fs');

var app = express();

var readFile = promise.denodeify(fs.readFile)

app.get('/init', function(req, res) {

    var cert = utils.ifnotundef(req.query.cert, 'C:\\ProgramData\\Qlik\\Sense\\Repository\\Exported Certificates\\localhost');
    var host = utils.ifnotundef(req.query.host, 'localhost');
    var ip = utils.ifnotundef(req.query.ip, req.headers.host.match(/([^:]+)(:([0-9]+))?/)[1])

    readFile(cert).then(function(certif) {

        return utils.addToWhiteList(ip, {
            restUri: 'https://' + host + ':4242',
            pfx: certif,
            passPhrase: '',
            UserId: 'qlikservice',
            UserDirectory: '2008R2-0'
        });

    }).then(function(ret) {
        console.log(ret);
    }, function(ret) {
        console.log(ret);
    });

});

var server = app.listen(11337, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('listening at %s:%s', host, port);
})