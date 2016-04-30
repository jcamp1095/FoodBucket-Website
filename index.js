// Initialization
var express = require('express');
var bodyParser = require('body-parser'); // Required if we need to use HTTP query or post parameters
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js

var app = express();
app.set('port', (process.env.PORT || 5000));

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
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_p2w0bqxx:js2vo2u1q34qbp5c7ta1lkun2k@ds021741.mlab.com:21741/heroku_p2w0bqxx' ||'mongodb://localhost/food_bucket';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	if(error) {
		console.log(error);
	}
	db = databaseConnection;
});

app.use(express.static(__dirname + '/public'));

//TODO: Display the text with an HTML file. The grabbing from db.collection 
app.get('/', function(request, response) {

	response.set('Content-Type', 'text/html');
	response.send('<p>Hello</p>');
	// var indexPage = '';
	// var sort = {"created_at": -1};

	// db.collection('checkins', function(er, collection) {
	// 	collection.find().sort(sort).toArray(function(err, cursor) {
	// 		if (!err) {
	// 			indexPage += "<!DOCTYPE HTML><html><head><title>Checkins</title></head><body><h1>Look Who's Checked In!</h1>";
	// 			for (var count = 0; count < cursor.length; count++) {
	// 				indexPage += "<p>" + cursor[count].login + " checked in at " +
	// 				               cursor[count].lat + " " + cursor[count].lng + " " + 
	// 				               "on " + cursor[count].created_at + ".</p>";
	// 			}
	// 			indexPage += "</body></html>"
	// 			response.send(indexPage);
	// 		} else {
	// 			response.send('<!DOCTYPE HTML><html><head><title>Who Checked In?</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
	// 		}
	// 	});
	// });
});


// GET USER DATA
app.get('/users', function(request, response) {

	var userId = request.query.userId; 
	 
	if(userId == "" || userId == undefined){
		response.send("[dsa]");
	}
	else{
		db.collection('bucketlist', function(er, collection) {
			collection.find({"userId": userId}).toArray(function(err, cursor) {
				if (!err) {
					response.send(cursor);
				} else {
					response.send('[]fdsa');
				}
			});
		});
	}
});

/*
// POST FRIENDS DATA TO DATABASE
app.post('/sendFriend', function(request, response) {

	// Post key
	var userId = request.body.userId;
	var friend_userId = request.body.friend_userId;

	var errormsg = '{"error":"Whoops, something is wrong with your data!"}';

	if (userId == null || userId == "" || friend_userId == null || friend_userId == "") {
		response.send(errormsg);
	}

	else {
		var toInsert = {
			friend: friend_userId
		};
	}

	//{ $push: { <field1>: <value1>, ... } }

	
	db.collection('checkins', function(error, bucket) {
		if (error) {
			response.send(errormsg);
		}

		else {
			collection.find({'userId': userId}.friends);
		}
	});

	
});
*/


// POST RESTAURANT DATA
app.post('/sendRestaurant', function(request, response) {

	// Post Keys
	var userId = request.body.userId;
	// var restaurant = request.body.restaurant; 
	// var phone = request.body.phone; 
	// var website = request.body.website; 
	// var ratings = parseFloat(request.body.ratings)
	// var lat = parseFloat(request.body.lat); 
	// var lng = parseFloat(request.body.lng);
	// var created_at = new Date();

	var errormsg = '{"error":"Whoops, something is wrong with your data!"}';
	var returnText = {}; 


	if (1){
		var toInsert = {
			"userId": userId,
			// "restaurant": restaurant,
			// "phone": phone,
			// "ratings": ratings,  
			// "website": website, 
			// "lat": lat,
			// "lng": lng, 
			// "created_at": created_at,
		};
		db.collection('bucketlist', function(error, bucket) {
			var id = bucket.insert(toInsert, function(error, saved) {
				if (error) {
					response.send(errormsg);
				}
				else {
					bucket.find().toArray(function(err, cursor){
						if(!err){
							response.send(cursor); 
						}
					});
				}
		    });
		});
	}
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// END OF FILE


