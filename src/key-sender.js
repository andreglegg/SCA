var exec = require('child_process').exec;
var path = require("path");

function isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1;
}

module.exports = function() {
    var module = {};

    /**
     * A key code is a numeric value starting with @ or a textual. For example, there are two key codes for letter 'A'.
     * The numeric is "@65" and the textual is "A".
     */
    module.tapKey = function(keyCode) {
        return module.execute([keyCode]);
    };

    module.toggleKey = function(keyCode) {
        return module.execute([keyCode]);
    };

    module.execute = function(arrParams) {
        return new Promise(function(resolve, reject) {
            var keyTapPath = path.join(__dirname, '/../../extraResources/', 'key-sender.exe');
            if (isDev()) {
                // Do dev stuff
                keyTapPath = path.join(__dirname, '/../extraResources/', 'key-sender.exe');
            }

            //var command = 'java -jar \"' + jarPath + '\" ' + arrParams.join(' ') + module.getCommandLineOptions();
            // var command = 'java -jar "' + jarPath + '" ' + arrParams.join(' ') + module.getCommandLineOptions();
            var command = keyTapPath + ' ' + arrParams.join(' ');

            return exec(command, {}, function(error, stdout, stderr) {
                if (error == null) {
                    resolve(stdout, stderr);
                } else {
                    reject(error, stdout, stderr);
                }
            });
        });
    };

    return module;
}();