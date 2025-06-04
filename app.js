//const { getExpressStore } = require('./lib/redis_connect');
var cfg = require('./config.json')

var express = require('express'),
app = express(),
load = require('express-load'),
server = require('http').createServer(app),
error = require('./middleware/error'),
cfg = require('./config.json')
io = require('socket.io')(server),
redis = require('./lib/redis_connect'),
//ExpressStore = redis.getExpressStore(),
socketStore = redis.getSocketStore(),

bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
expressSession = require('express-session'),
methodOverride = require('method-override'),
parserSecret = cookieParser(cfg.SECRET),
store = new expressSession.MemoryStore(),
mongoose = require('mongoose');


var cookie = cookieParser(cfg.SECRET)
 , storeOpts = {client: redis.getClient(), 
                 prefix: cfg.KEY}
 //, store = new ExpressStore(storeOpts)
 , sessOpts = {secret: cfg.SECRET, key: cfg.KEY, store: store}
 , session = express.session(sessOpts);

 //io.set('log level', 1);
 //io.set('store',  socketStore);

mongoose.connect('mongodb://localhost/ntalk');
mongoose.connection.on('error', (err) => {
  console.log('error', err);
});
mongoose.Promise = global.Promise;

app.use(express.logger('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookie);
app.use(session);
app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride());
app.use(express.compress(cfg.GZIP_LVL));
app.use(app.router);
app.use(express.static(__dirname + '/public', cfg.MAX_AGE));
app.use(error.notFound);
app.use(error.serverError);

app.use(parserSecret);
app.use(
  expressSession({
    secret: SECRET,
    name: KEY,
    resave: true,
    saveUninitialized: true,
    store: store,
  })
);

io.enable('blowser client cache');
io.enable('browser client minification');
io.enable('blowser client etag');
io.enable('browser client gzip');
io.set('log level', 1);
io.set('store', new socketStore);
io.set('authorization', function (data, accept) {
  cookie(data, {}, function (err) {
    var sessionID = data.signedCookies[cfg.KEY];
    store.get(sessionID, function (err, session) {
      if (err || !session) {
        accept(null, false);
      } else {
        data.session = session;
        accept(null, true);
      }
    });
  });
});

load('models').then('controllers').then('routes').into(app);
load('sockets').into(io);

io.sockets.on('connection', function (client) {
  client.on('send-server', function (data) {
    var msg = '<b>' + data.nome + ':</b> ' + data.msg + '<br>';
    client.emit('send-client', msg);
    client.broadcast.emit('send-client', msg);
  });
});
/* app.get('/', routes.index);
app.get('/usuarios', routes.user.index); */

module.exports = app;
server.listen(3000, function () {
  console.log('Ntalk no ar.');
});
