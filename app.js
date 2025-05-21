const { getExpressStore } = require('./lib/redis_connect');
const SECRET = 'Ntalk', KEY = 'ntalk.sid'
 , MAX_AGE = {maxAge: 3600000}
 , GZIP_LVL = {LEVEL:9, memLevel: 9};

var express = require('express'),
app = express(),
load = require('express-load'),
server = require('http').createServer(app),
error = require('./middleware/error'),
io = require('socket.io')(server),
redis = require('./lib/redis_connect'),
expressStore = redis.getExpressStore(),
socketStore = redis.getSocketStore(),

bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
expressSession = require('express-session'),
methodOverride = require('method-override'),
parserSecret = cookieParser(SECRET),
store = new expressSession.MemoryStore(),
mongoose = require('mongoose');


var cookie = express.cookieParser(SECRET)
 , storeOpts = {client: redis.getClient(), prefix: KEY}
 , store = new ExpressStore (storeOpts)
 , sessOpts = {secret: SECRET, key: KEY, store: store}
 , session = express.session(sessOpts);

 io.set('log level', 1);
 io.set('store', new socketStore);

mongoose.connect('mongodb://localhost/ntalk');
mongoose.connection.on('error', (err) => {
  console.log('error', err);
});
mongoose.Promise = global.Promise;

app.use(express.logger());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookie);
app.use(session);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
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


io.use('authorization', function (data, accept) {
  cookie(data, {}, function (err) {
    var sessionID = data.signedCookies[KEY];
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
