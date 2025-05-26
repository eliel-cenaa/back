var forever = require('forever-monitor');
var monitor = forever.monitor;

var child = new monitor('clusters.js',{
    max: 10,
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