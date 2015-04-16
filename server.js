var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;

/************  Connect to Mongo ***********/
// Load the library we need to connect to mongo
// using mongoose
var mongoose = require('mongoose');

// Get this value from `heroku config`
var mongodbUri = 'mongodb://heroku_app35835439:rfu8pfq812363mtn9avn68criv@ds061651.mongolab.com:61651/heroku_app35835439?replicaSet=rs-ds061651';

mongoose.connect(mongodbUri);
var db = mongoose.connection;
db.on('error', function(error){
  console.log('There was an error connecting to mongo: ' + error);
});
db.once('open', function(){
  console.log('Successfully connected to mongo!');
});

var userSchema = mongoose.Schema({
  username: String
});

var User = mongoose.model('users', userSchema);

/*********** End of mongoo connection stuff ***/

// sets us up to use ejs templating
app.set('view engine', 'ejs');

// this is needed in order to read data
// that is POSTed to any route
// This line MUST come BEFORE the lines where
// we configure our app routes (app.get or app.post)
app.use(bodyParser.urlencoded({extended:true}));

// Using `app.get('/')` configures our app
// to listen for an http GET request for the "/" url
app.get('/', function(req, res){
  User.find({}, function(error, users){
    if (error) {
       res.send('Error fetching users: ' + error);
    } else {
      // renders the file at views/index.ejs
      res.render('index', {users: users});
    }
  });
});

// configure our express app to listen for an http POST
// request for the '/create_user' url.
// We can read the posted data from the `req.body` object,
// which exists because we previously configured the
// app to use the bodyParser
app.post('/create_user', function(req, res){

  // req.body has a `username` property because
  // the HTML form had an input with a `name="username"`
  // attribute
  var username = req.body.username;

  var user = new User({username: username});

  user.save(function(err){
    if (err) {
      res.send('Error saving user: ' + err);
    } else {
      res.redirect('/');
    }
  });
});

app.listen(port, function(){
  console.log('started on port ',port);
});
