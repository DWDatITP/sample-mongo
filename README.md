# Sample Mongo

This is a sample app showing how to connect to mongo and use Mongoose
to create a model, save it and then fetch it.

## Installation

  * `git clone https://github.com/DWDatITP/sample-mongo.git`
  * `cd sample-mongo`
  * `npm install`
  * `nodemon server.js`

## Adding mongo

You must first create a heroku app, but then you can do:

  * `heroku addons:add mongolab`

This will create a new mongo database for you that runs at mongolab.

To see its connection information, type:

  * `heroku config`

And look for the line that starts with `MONGOLAB_URI`. This is the
connection string you can use to connect to mongo.

To view your mongo database at mongolab, type:

  * `heroku addons:open mongolab`

You'll see a screen that looks like this: http://take.ms/Dc1pY.
