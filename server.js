var forever = require('forever-monitor');
var monitor = forever.Monitor;

var child = new monitor('clusters.js',{
    max: 1,
    silent: true,
    killtree: true,
    logFILE: 'forever.log',
    outFile: 'app.log',
    errFile: 'error.log'

});
child.on('exit', function () {
    console.log('O servidor foi finalizado.')
});

child.start();