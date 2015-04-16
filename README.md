# Sample Mongo

This is a sample app showing how to connect to mongo and use Mongoose
to create a model, save it and then fetch it.

## Installation

  * `git clone https://github.com/DWDatITP/sample-mongo.git`
  * `cd sample-mongo`
  * `npm install`
  * `nodemon server.js`

## Adding mongo to your existing application

### Adding Mongoose and connecting to Mongolab

To add mongo, do the following:

First, install (and save) the mongoose library:

  * `npm install mongoose --save`

This installs mongoose locally and updates your package.json
to have it (this is necessary for your app to work properly at heroku).

Next, in your server.js, just after the top, add this line, which brings
in mongoose:

`var mongoose = require('mongoose');`

Next, get the connection string for your mongo account.
You can use the shared class connection string to start with, or see
the section below for how to create your own mongo and get your own
connection string.

The class connection string is:
`mongodb://heroku_app35835439:rfu8pfq812363mtn9avn68criv@ds061651.mongolab.com:61651/heroku_app35835439?replicaSet=rs-ds061651`

We need to capture it in a variable, so add this line to your server.js,
after the line where you required mongoose:

`var mongodbUri = 'mongodb://heroku_app35835439:rfu8pfq812363mtn9avn68criv@ds061651.mongolab.com:61651/heroku_app35835439?replicaSet=rs-ds061651';`

[Link to
code](https://github.com/DWDatITP/sample-mongo/blob/5b3b2112212bc98cb1ca898f6022a28d415bdb03/server.js#L12).

Next step is to tell mongoose to connect to this url. Add to your
server.js:

`mongoose.connect(mongodbUri);`

[Link to
code](https://github.com/DWDatITP/sample-mongo/blob/5b3b2112212bc98cb1ca898f6022a28d415bdb03/server.js#L14).

Then get the connection from mongoose and store it in a variable called
`db`:

```
var db = mongoose.connection;
```

[Link to
code](https://github.com/DWDatITP/sample-mongo/blob/5b3b2112212bc98cb1ca898f6022a28d415bdb03/server.js#L15).

With this `db` variable, we can add two callbacks for two events that
the db can emit: `error`, and `open`. Note that this is just so that we
can log to the console when these events happen, these lines do not
actually make a connection. You could leave them out of your app, but
then you wouldn't see a console.log message when the db connected (or,
more importantly, if it errored connecting).

This configures a callback that will happen every time there is an error
with the database (using `db.on`), and a callback that will happen only
the first time the db connection gets opened (using `db.once`).

```
db.on('error', function(error){
  console.log('There was an error connecting to mongo: ' + error);
});
db.once('open', function(){
  console.log('Successfully connected to mongo!');
});
```

[Link to
code](https://github.com/DWDatITP/sample-mongo/blob/5b3b2112212bc98cb1ca898f6022a28d415bdb03/server.js#L16-L21).

You should be able to run your app now and see the message "Successfully
connected to mongo!" appear in the server console. Once you have that
working, continue.

### Defining a schema and model

We need to define what type of properties our mongoose model will have.
We do that using a "schema". For this example we'll make a `User` model,
so start by defining a user "schema":

```
var userSchema = mongoose.Schema({
  username: String
});
```

[Link to
code](https://github.com/DWDatITP/sample-mongo/blob/5b3b2112212bc98cb1ca898f6022a28d415bdb03/server.js#L23-L25).

Now that we have a schema, define the User model. We use a capitalized
word for our `User` variable because it is a class (this is a convention
in JavaScript programming):

```
var User = mongoose.model('users', userSchema);
```

[Link to
code](https://github.com/DWDatITP/sample-mongo/blob/5b3b2112212bc98cb1ca898f6022a28d415bdb03/server.js#L27).

The first argument, `'users'`, tells mongoose what collection to use in
our mongo database to store User models. You could use a different value
for this if you like. And if you app has multiple models, they should
each have a different collection that you store them in.

The second argument: `userSchema` tells mongoose what schema to use for
the User model. Mongoose will try to enforce this shape on your data
when you save new users. If you later decide your user model needs
another property, you must remember to add it to the `userSchema`,
otherwise Mongoose won't save that property to the database when you
save a user.

You should try running your server again and ensure there are no errors.

### Querying the database

Now that your app has a mongoose model and a database connection, we
can start querying for users.

This part has two steps:

  1. Update our server.js to find users
  2. Update one of our templates to display those users

You can use an existing route you have configured in your app, or make a
new one for this step. We'll assume you're using the index (`/`) route.

Inside your `app.get` function callback, add this code that searches for
users:

```
User.find({}, function(error, users){
  // here, inside this function, we have the results of the
  // database query
});
```

We'll want to handle the error if there was one, and also make sure
that we are rendering our index file from within this function, because
the database results are only available there. So add this code inside
that callback function:

```
  if (error) {
     res.send('Error fetching users: ' + error);
  } else {
    res.render('index', {users: users});
  }
```

After you're done, the whole handler for the route will look like:
```
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
```

[Link to
code](https://github.com/DWDatITP/sample-mongo/blob/5b3b2112212bc98cb1ca898f6022a28d415bdb03/server.js#L43-L50).

Next, we need to update our template so that it can show the users.
In the case of this example we are rendering the `index.ejs` file
located at `views/index.ejs`. If
you are using a different template, you should edit that one instead.

This is the javascript code we want to execute in our template:
```
users.forEach(function(user) {
  // print out user information
});
```

To embed this javascript in the template you need to add the delimiters
(`<%` and `%>`) around the javascript, which looks like this:
```
<% users.forEach(function(user) { %>
   // this part will be run once for each user
<% }); %>
```

To actually show the users, replace the comment with the HTMl that we
want to show for each of the users:
`<p>User: <%= user.username %></p>`

Altogether it looks like this:

```
<% users.forEach(function(user){ %>
  <p>User: <%= user.username %></p>
<% }); %>
```

[Link to
code](https://github.com/DWDatITP/sample-mongo/blob/5b3b2112212bc98cb1ca898f6022a28d415bdb03/views/index.ejs#L17-L19).

Try running your again to make sure it's still working. If you are
connected to the class mongo database you should see some users show up.
If you're connected to another database it might not have any users yet.
If you're curious about what exactly is coming back from the database,
you can add a console.log line in the route callback in your server.js,
right before your `res.render` line:

`console.log('Got users from database:',users);`

### Saving new data to the database

The last step is to set up a form to post information to your server and
use that for saving new users. If you are using the class `sample-mongo`
app as a starter you already have a form on the index page that posts a
username to the `/create_users` route. If you are using your own app,
make sure to add a form to your template and a route to handle it now.

Inside the route that receives the POSTed for input, add this code to
create a new user:

`var user = new User({ username: username});`

This code assumes you have a variable called `username` with the input
that the person submitted in their form. You may have to change the
username variable (on the right side of the `:`) to match the variable
you are using.

That code created a new instance of a User mongoose model, but it's not
saved yet.

To save it, call `save` and give it an argument that is the function to
call after it has saved, like this:

```
user.save(function(err){
  // inside this function, the `save` call has finished
});
```

We need to handle that error, if there is one, or else do something
now that the user has been saved. Let's redirect back to the index
route. So inside the callback add this code:

```
if (err) {
  res.send('Error saving user: ' + err);
} else {
  res.redirect('/');
}
```

Altogether the route handler looks like this:
```
app.post('/create_user', function(req, res){
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
```

[Link to
code](https://github.com/DWDatITP/sample-mongo/blob/5b3b2112212bc98cb1ca898f6022a28d415bdb03/server.js#L58-L74).

Now run your app and you should be able to save a user and see it appear
at the end of the list of users on the index page.

### Setting up your own mongo instance at mongolab

It's fine to use the shared class database to get up and running, but
you need to use your own mongo database for your app. Here's how you
create it.

If you don't already have a heroku app, you should create one by typing
this into your terminal:

`heroku create`

After you've created a heroku app you can tell it to add a mongolab
database for you with this command:

`heroku addons:add mongolab`

Note: every heroku app you make will have its *own* mongo database at
mongolab. You'll want to re-run that command for each heroku app that
you make. You don't want to share the same mongolab databse between
different apps.

To confirm that worked you can view the mongolab admin panel by typing:

`heroku addons:open mongolab`

This will open up the admin panel for this mongolab database.
You'll see a screen that looks like this: http://take.ms/Dc1pY.

The final step is to get the connection string for your new database and
modify your server.js to use it instead of the class database.

Type this to see the connection information for your mongolab database:

`heroku config`

Look for the line that starts with `MONGOLAB_URI`. This is the
connection string you can use to connect to mongo. Change the line in
your server.js where you used the class database connection string to
use this one instead.
