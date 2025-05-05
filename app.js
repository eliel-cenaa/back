const KEY = 'ntalk.sid'
  , SECRET = 'ntalk';

var express = require('express')
  , load = require('express-load')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , expressSession = require('express-session')
  , methodOverride = require('method-override')
  , cookie = cookieParser(SECRET)
  , store = new expressSession.MemoryStore()
  , app = express()
  , server = require('http').createServer(app)
  , error = require('./middleware/error')
  , io = require('socket.io')(server)
  , mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/ntalk');
  mongoose.connection.on('error',err=>{
    console.log("error", err)
  });
  mongoose.Promise=global.Promise

  
 




app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookie);
app.use(expressSession({
  secret: SECRET,
  name: KEY,
  resave: true,
  saveUninitialized: true,
  store: store
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

io.use('authorization', function(data, accept){
  cookie(data, {}, function(err) {
    var sessionID = data.singnedCookies[KEY];
    store.get(sessionID, function(err, session) {
      if (err || !session) {
        accept(null, false);
      } else {
        data.session = session;
        accept(null, true);
      }
    });
  });
});

load('models')
.then('controllers')
.then('routes')
.into(app);
load('sockets')
.into(io)


io.sockets.on('connection', function (client) {
  client.on('send-server', function (data){
    var msg = "<b>"+data.nome+":</b> "+data.msg+"<br>";
    client.emit('send-client', msg);
    client.broadcast.emit('send-client',msg);
  });
});
/* app.get('/', routes.index);
app.get('/usuarios', routes.user.index); */
app.use(error.notFound);
app.use(error.serverError);

module.exports = app;
server.listen(3000, function () {
  console.log("Ntalk no ar.");
});
