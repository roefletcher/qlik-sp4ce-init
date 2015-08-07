var utils = require('qlik-utils');
var promise = require('promise');
var fs = require('fs');
var uuid = require('node-uuid');
var Q = require('q');

var readFile = promise.denodeify(fs.readFile);


function add(certif, host, ip, retry, httpTimeout, task) {

    return utils.addToWhiteList(ip, {

        restUri: 'https://' + host + ':4242',
        pfx: certif,
        passPhrase: '',
        UserId: 'qlikservice',
        UserDirectory: '2008R2-0',
        timeout: httpTimeout

    }).then(function(ret) {

        task.done(ret);
        return ret;

    }, function(ret) {

        if(retry == 1)
            task.failed(ret);

        return Q.reject(ret);

    });

}

function loop(certif, host, ip, retry, retryTimeout, httpTimeout, status, task) {

    var added = add(certif, host, ip, retry, httpTimeout, task);

    if(retry == 1) {

        return added;

    } else {

        return added.then(function (ret) {

            return ret;

        }, function (ret) {

            return utils.setTimeout2Promise(retryTimeout).then(function () {

                task.running(ret);
                return loop(certif, host, ip, retry -1, retryTimeout, httpTimeout, status, task);

            });

        });


    }

}

var tasks = {};
function createTask(certif, host, ip, retry, retryTimeout, httpTimeout, task) {

    loop(certif, host, ip, retry, retryTimeout, httpTimeout, 'running', task);

    return task.listen;

}

function init(options, headers) {

    var cert = utils.ifnotundef(options.cert, 'C:\\ProgramData\\Qlik\\Sense\\Repository\\Exported Certificates\\localhost\\client.pfx');
    var host = utils.ifnotundef(options.host, 'localhost');
    var ip = utils.ifnotundef(options.ip, headers.host.match(/([^:]+)(:([0-9]+))?/)[1]);
    var retry = utils.ifnotundef(options.retry, 30);
    var httpTimeout = utils.ifnotundef(options.httpTimeout, 10000);
    var retryTimeout = utils.ifnotundef(options.retryTimeout, 5000);

    var task = new utils.task();
    tasks[task.guid] = task;
    task.start();

    readFile(cert).then(function(certif) {

        return createTask(certif, host, ip, retry, retryTimeout, httpTimeout, task);

    }).then(function(ret) {

        return ret;

    }, function(ret) {

        return ret;

    });

    return task;

}

module.exports = {
    init: init
};
