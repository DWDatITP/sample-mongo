var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;

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
  // renders the file at views/index.ejs
  res.render('index');
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

  res.send('Now I would create a user named: ' + username);
});

app.listen(port, function(){
  console.log('started on port ',port);
});
