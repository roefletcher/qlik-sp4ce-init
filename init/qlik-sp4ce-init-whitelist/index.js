var utils = require('qlik-utils');
var promise = require('promise');
var fs = require('fs');

var readFile = promise.denodeify(fs.readFile);

function init(options, headers) {

    var cert = utils.ifnotundef(options.cert, 'C:\\ProgramData\\Qlik\\Sense\\Repository\\Exported Certificates\\localhost\\client.pfx');
    var host = utils.ifnotundef(options.host, 'localhost');
    var ip = utils.ifnotundef(options.ip, headers.host.match(/([^:]+)(:([0-9]+))?/)[1]);

    return readFile(cert).then(function(certif) {

        return utils.addToWhiteList(ip, {
            restUri: 'https://' + host + ':4242',
            pfx: certif,
            passPhrase: '',
            UserId: 'qlikservice',
            UserDirectory: '2008R2-0'
        });

    }).then(function(ret) {
        return ret;
    }, function(ret) {
        return ret;
    });

}

module.exports = {
    init: init
};
