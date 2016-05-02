/*______________________________________________________________________________
|
|
|           			Server for Food Bucketlist Project 
|       
|
|_____________________________________________________________________________*/


// Initialization
var express = require('express');
var bodyParser = require('body-parser'); // Required if we need to use HTTP query or post parameters
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js

var app = express();
app.set('port', (process.env.PORT || 5000));

// Enables cross-origin resource sharing
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true })); // Required if we need to use HTTP query or post parameters

// Mongo initialization and connect to database
// process.env.MONGOLAB_URI is the environment variable on Heroku for the MongoLab add-on
// process.env.MONGOHQ_URL is the environment variable on Heroku for the MongoHQ add-on
// If environment variables not found, fall back to mongodb://localhost/nodemongoexample
// nodemongoexample is the name of the database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_m48kr2dc:ocq0pr57l50lc5m77cqbenqm1l@ds053380.mlab.com:53380/heroku_m48kr2dc';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	if(error) {
		console.log(error);
	}
	db = databaseConnection;
});

app.use(express.static(__dirname + '/public/front-end'));

// Global Variable
var errormsg = '{"error": "Whoops, something is wrong with your data!"}';


//
// What does this do? What should I add?
//
app.get('/', function(request, response) {

	//response.set('Content-Type', 'text/html');
	response.sendFile('public/front-end/index.html', {root: __dirname});
});



//
// GET A SPECIFIC USER'S DATA
//
app.get('/user', function(request, response) {

	var userId = request.query.userId;
	var username = request.query.username;
	 
	if(userId == "" || userId == undefined) {
		response.send(errormsg);
	}
	
	db.collection('users', function(error, theUsers) {
		theUsers.find({"userId": userId}).toArray(function(error, userData) {
			if (error) {
				response.send(500);
			}

			response.send(userData);
		});
	});
});


//
// POST A USER TO THE DATABASE
// - Sends back the JSON object of the user who is specified by the userId
//
app.post('/sendUser', function(request, response) {

	var userId = request.body.userId;
	var username = request.body.username;

	if (userId == null || userId == "") {
		request.response(errormsg);
	}

	var toInsert = {
		"userId": userId,
		"username": username
	};

	db.collection('users', function(error, theUsers) {
		if (error) {
			response.send(500);
		}

		var id = theUsers.insert(toInsert, function(error, saved) {
			if (error) {
				response.send(500);
			}

			theUsers.find().toArray(function(error, userData) {
				if (error) {
					response.send(500);
				}

				response.send(userData);
			});
		});
	});
});

//
// POST FRIENDS DATA TO A SPECIFIC USER IN THE DATABASE
// - Sends back the object of the user who is specified by the userId
//
app.post('/sendFriend', function(request, response) {

	var userId = request.body.userId;
	var friend_userId = request.body.friend_userId;

	if (userId == null || friend_userId == null || userId == "" || friend_userId == "") {
		response.send(errormsg);
	}

	db.collection('users', function(error, theUsers) {
		if (error) {
			response.send(500);
		}

		var id = theUsers.update({"userId": userId}, {$push: {"friends": friend_userId}}, function(error, saved) {
			if (error) {
				response.send(500);
			}

			theUsers.find().toArray(function(error, userData) {
				if (error) {
					response.send(500);
				}

				response.send(userData);
			});
		});
	});
});

//
// POST RESTAURANT DATA TO A SPECIFIC USER IN THE DATABASE
// - Sends back the object of the user who is specified by the userId
//
app.post('/sendRestaurant', function(request, response) {

	var userId = request.body.userId;
	var username = request.body.username;
	var restaurant = request.body.name; 
	var phone = request.body.phone;
	var ratings = parseFloat(request.body.ratings);
	var website = request.body.website; 
	var lat = parseFloat(request.body.lat); 
	var lng = parseFloat(request.body.lng);
	var created_at = new Date();

	if (userId == null || userId == "" || restaurant == null || restaurant == "") {
		response.send(errormsg);
	}

	var restaurantObj = {
			"userId": userId,
			"username": username,
			"restaurant": restaurant,
			"phone": phone,
			"ratings": ratings,  
			"website": website,
			"lat": lat,
			"lng": lng,
			"created_at": created_at
	};

	db.collection('users', function(error, bucket) {
		if (error) {
			response.send(500);
		}

		var id = bucket.update({"userId": userId}, {$push: {"bucketlist": restaurantObj}}, function(error, saved) {
			if (error) {
				response.send(500);
			}

			bucket.find({"userId": userId}).toArray(function(error, user){
				if(error) {
					response.send(500); 
				}

				response.send(user);
			});
	    });
	});
});

//
// Let the node app run
//
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


//____________________________END OF FILE_______________________________________
