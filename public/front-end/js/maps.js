var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);

var myOptions = {
    zoom: 13, // The larger the zoom number, the bigger the zoom
    center: me,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var my_list;
var id;
var user_name;


// Yelp API Set Up --- Begin
function use_yelp(loc, color) {
    var auth = { 
        consumerKey : "7MBEG1e9PahKicsLORsPsw",
        consumerSecret : "do4Fgu9DHpGo-IlRX1iAoOeLZlc",
        accessToken : "82rp9T6IOODTWdg3EFnN0wIYTTi35M4C",
        accessTokenSecret: "rBUn0Zr8VWKH9QjA2UYuSyQ8V0w",
    };  

    //Yelp API authorization

    var terms = 'food';
    //var near = 'San+Francisco';
    var near = loc;
    
    var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
    };

    parameters = [];
    parameters.push(['term', terms]);
    parameters.push(['location', near]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    //Parameters for user

    var message = {
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
    //console.log(parameterMap); // TODO: Delete 

    var bestRestaurant = "Some random restaurant";
    // Yelp API Set UP --- End

    $.ajax({
        'url': message.action,
        'data': parameterMap,
        'cache': true,
        'dataType': 'jsonp',
        'jsonpCallback': 'cb',
        'success': function(data, textStats, XMLHttpRequest) {
            //alert("good");
            for (i = 0; i < data['businesses'].length; i++) {
                //alert(data['businesses']);
                //set_list_Marker(data['businesses'][i], color);
                setMarker(data['businesses'][i], color);
            }
        }
    });
}


$(document).ready(function () {
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    getMyLocation();
});


function getMyLocation() {
    if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;

            renderMap();

            $('#search_input').on('keypress', function(e){
                var code = (e.keyCode ? e.keyCode : e.which);
                if(code == 13) {
                    e.preventDefault();
                    loc = document.getElementById('search_input').value;

                    use_yelp(loc, "red");

                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode( { 'address': loc}, function(results, status) {
                        searchCoords = results[0].geometry.location;
                        searchCenter = new google.maps.LatLng(searchCoords.lat(), searchCoords.lng());
                        map.panTo(searchCenter);
                    });
                }
            });
        });
    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }
}

//Creates map
function renderMap()
{
        me = new google.maps.LatLng(myLat, myLng);
        
        // Update map and go there...
        map.panTo(me);

        // Create a marker
        marker = new google.maps.Marker({
                position: me,
                title: "Here I Am!"
        });
        marker.setMap(map);
                
        // Open info window on click of marker
        google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(marker.title);
                infowindow.open(map, marker);
        });
}


function setMarker(object, color)
{
        latit = object['location']['coordinate']['latitude'];
        longit = object['location']['coordinate']['longitude'];
        var curr_loc = new google.maps.LatLng(latit, longit);
        var marker = new google.maps.Marker({
                position: curr_loc,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/'+color+'-dot.png',
                title: object.name
        });
                
        google.maps.event.addListener(marker, 'click', function() {

                var message = "<b>Name: </b>" + object['name'] + "<BR><b>Phone Number: </b>" + 
                    object['display_phone'] + "<BR><b>Yelp Rating (out of 5): </b>" + object['rating'] + 
                    "<BR><b>Address: </b>" + object['location']['display_address'] + 
                    "<BR><b>Categories: </b>" + object['categories'] +"<BR><a href=" + object['url'] + ">go to yelp </a>" + 
                    "<BR><button onClick='sendMail(\"" + object['name'] +"\",\""
                                                                                        + object['display_phone'] +"\",\""
                                                                                        + object['rating'] +"\",\""
                                                                                        + object['url'] +"\",\""
                                                                                        + object['location']['coordinate']['latitude'] +"\",\""
                                                                                        + object['location']['coordinate']['longitude'] +"\",\""
                        +"\")'> Recommend to a friend!</button>" + 
                    "<BR><button type='button' id = 'button_add' onClick='addtolist(\"" + object['name'] +"\",\""
                                                                                        + object['display_phone'] +"\",\""
                                                                                        + object['rating'] +"\",\""
                                                                                        + object['url'] +"\",\""
                                                                                        + object['location']['coordinate']['latitude'] +"\",\""
                                                                                        + object['location']['coordinate']['longitude'] +"\",\""
                        +"\")' class='btn btn-primary'>Add to list</button>";

                infowindow.setContent(message); 
                infowindow.open(map, marker);
        });
}


function addtolist(name, phone, rating, url, lat, lng)
{
        var user_name;
        var id;

        FB.api('/me', function(response) {
                id = response.id;
                user_name = response.name;

                
                food_data = { "userId"     : id, 
                          "restaurant" : name,
                          "phone"      : phone, 
                          "ratings"    : rating, 
                          "website"    : url, 
                          "lat"        : lat,
                          "lng"        : lng,
                          "created_at" : new Date()
                        };

                $.ajax({
                 type: "POST",
                 url: "https://food-bucket.herokuapp.com/sendRestaurant",
                 data: food_data,
                 success: alert("it worked son"),
                 dataType: 'json'
                });
        });

}


function add_to_map()
{
        var user_name;
        var id;
        FB.api('/me', function(response) {
                id = response.id;
                user_name = response.name;

                var url = "https://food-bucket.herokuapp.com/user?userId=" + id + "&username=" + user_name;
                var data_request = new XMLHttpRequest();

                data_request.open("GET", url, true);
                
                data_request.onreadystatechange = function () {
                        if (data_request.readyState == 4 && data_request.status == 200) {
                                raw = data_request.responseText;
                                data = JSON.parse(raw);
                                console.log(data);
                                for (i = 0; i < data['0']['bucketlist'].length; i++) {
                                        set_list_Marker(data['0']['bucketlist'][i], "blue");
                                }

                                lat = data['0']['bucketlist'][0]['lat'];
                                lng = data['0']['bucketlist'][0]['lng'];

                                var geocoder = new google.maps.Geocoder();
                                var myLatLng =  new google.maps.LatLng(lat, lng);

                                geocoder.geocode( {'latLng': myLatLng}, function(results, status) {
                                    searchCoords = results[0].geometry.location;
                                    searchCenter = new google.maps.LatLng(searchCoords.lat(), searchCoords.lng());
                                    map.panTo(searchCenter);
                                });
                                
                        } else if (data_request.readyState == 4 && data_request.status != 200) {
                                alert("Failed to Load Data!");
                        }
                };

                data_request.send(null);
        });


}


function set_list_Marker(object, color)
{
        latit = object['lat'];
        longit = object['lng'];

        var curr_loc = new google.maps.LatLng(latit, longit);
        var marker = new google.maps.Marker({
                position: curr_loc,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/'+color+'-dot.png',
                title: object.restaurant
        });
                
        google.maps.event.addListener(marker, 'click', function() {

                var message = "<b>Name: </b>" + object['restaurant'] + "<BR><b>Phone Number: </b>" + 
                    object['phone'] + "<BR><b>Yelp Rating (out of 5): </b>" + object['ratings'] + 
                    "<BR><b>Website: </b>" + object['website'] +  "<BR><button onClick='sendMail(\"" + object['restaurant'] +"\",\""
                                                    + object['display_phone'] +"\",\""
                                                    + object['rating'] +"\",\""
                                                    + object['url'] +"\",\""
                                                    + object['lat'] +"\",\""
                                                    + object['lng'] +"\",\""
                    +"\")'> Recommend to a friend!</button>";

                infowindow.setContent(message); 
                infowindow.open(map, marker);
        });
}

//send userRR
function send_user_info(id, user_name) {

        FB.api('/me', function(response) {
                id = response.id;
                user_name = response.name;
                user_data = { "userId"     : id, 
                              "username"       : user_name,
                            };

                $.ajax({
                 type: "POST",
                 url: "https://food-bucket.herokuapp.com/sendUser",
                 data: user_data,
                 success: alert ("sent user data"),
                 dataType: 'json'
                });
        });
}


function sendMail(name, phone, rating, url, lat, lng) {
        var message = "&body=Hey! Check out this restaurant that I found on Bucket List.  Its SOOOO cool.  The name is " + name + ".  Want to go check it out, just casual no biggie.  Unless you want to make it something more... ;)";
        var link = "mailto:sample@address.com" + "?subject=Check out this Restaurant!" + message;
        window.location.href = link;
}



function MyBucketController($scope) {

        var restaurant_names = [];

        $(document).on('fbload', function(){
            FB.api('/me', function(response) { 
                id = response.id;
                user_name = response.name;

                var url = "https://food-bucket.herokuapp.com/user?userId=" + id + "&username=" + user_name;
                var data_request = new XMLHttpRequest();

                data_request.open("GET", url, true);
                
                data_request.onreadystatechange = function () {
                        var data_bucket;
                        if (data_request.readyState == 4 && data_request.status == 200) {
                                raw = data_request.responseText;
                                data_bucket = JSON.parse(raw);
                                console.log(data);
                                for (i = 0; i < data_bucket['0']['bucketlist'].length; i++) {
                                        name_data = data_bucket['0']['bucketlist'][i]['restaurant'];
                                        names = {name: name_data};
                                        restaurant_names.push(names);
                                        
                                }

                                $scope.$apply(function() {
                                    $scope.restaurants = restaurant_names;
                                });
                            
                                //put a restaurant on a map
                                $scope.$apply(function() {
                                    $scope.put_on_map = function(name) { 
                                            var latitude, longitude;
                                            for (i = 0; i < data_bucket['0']['bucketlist'].length; i++) {
                                                    name_data = data_bucket['0']['bucketlist'][i]['restaurant'];
                                                    if (name == name_data) {
                                                        latitude = data_bucket['0']['bucketlist'][i]['lat'];
                                                        longitude = data_bucket['0']['bucketlist'][i]['lng'];
                                                        object = data_bucket['0']['bucketlist'][i];
                                                        break;
                                                    }
                                            }

                                            var curr_loc = new google.maps.LatLng(latitude, longitude);
                                            var marker_new = new google.maps.Marker({
                                                    position: curr_loc,
                                                    map: map,
                                                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                                    title: object.restaurant
                                            });
                                            
                                            var message = "<b>Name: </b>" + object['restaurant'] + "<BR><b>Phone Number: </b>" + 
                                                        object['phone'] + "<BR><b>Yelp Rating (out of 5): </b>" + object['ratings'] + 
                                                        "<BR><b>Website: </b>" + object['website'] + 
                                                        "<BR><button onClick='sendMail(\"" + object['restaurant'] +"\",\""
                                                                                        + object['display_phone'] +"\",\""
                                                                                        + object['rating'] +"\",\""
                                                                                        + object['url'] +"\",\""
                                                                                        + object['lat'] +"\",\""
                                                                                        + object['lng'] +"\",\""
                                                        +"\")'> Recommend to a friend!</button>";

                                            infowindow.setContent(message); 
                                            infowindow.open(map, marker_new);
                                            google.maps.event.addListener(marker_new, 'click', function() {
                                                    infowindow.open(map, marker_new);
                                            });
                                    };
                            });
                                
                        } else if (data_request.readyState == 4 && data_request.status != 200) {
                                alert("Failed to Load Data!");
                        }
                        
                };

                data_request.send(null);
            });
        });
    
}

function GroupController($scope) {

        var friendslist = [];

        $(document).on('fbload', function(){
            FB.api('/me', function(response) { 
                id = response.id;
                user_name = response.name;

                var url = "https://food-bucket.herokuapp.com/user?userId=" + id + "&username=" + user_name;
                var data_request = new XMLHttpRequest();

                data_request.open("GET", url, true);
                
                data_request.onreadystatechange = function () {
                        if (data_request.readyState == 4 && data_request.status == 200) {
                                raw = data_request.responseText;
                                data = JSON.parse(raw);
                                console.log(data);
                                for (i = 0; i < data['0']['friends'].length; i++) {
                                        name_data = data['0']['friends'][i]['username'];
                                        names = {name: name_data};
                                        friendslist.push(names);
                                        
                                }

                                $scope.$apply(function() {
                                    $scope.friends = friendslist;
                                });
                            
                                //put friends restaurant on map
                                $scope.$apply(function() {
                                    $scope.put_friend_map = function(name) { 
                                            var id, user_name;
                                            for (i = 0; i < data['0']['friends'].length; i++) {
                                                    if (data['0']['friends'][i]['username'] == name) {
                                                            id = data['0']['friends'][i]['userId'];
                                                            user_name = data['0']['friends'][i]['username'];
            
                                                            break;
                                                    }
                                            }

                                            var url = "https://food-bucket.herokuapp.com/people?userId=" + id + "&username=" + user_name;
                                            var data_request = new XMLHttpRequest();

                                            data_request.open("GET", url, true);

                                            data_request.onreadystatechange = function () {
                                                    if (data_request.readyState == 4 && data_request.status == 200) {
                                                            raw = data_request.responseText;
                                                            data = JSON.parse(raw);
                                                            for (i = 0; i < data['0']['bucketlist'].length; i++) {
                                                                    set_list_Marker(data['0']['bucketlist'][i], "yellow");
                                                            }


                                                            lat = data['0']['bucketlist'][0]['lat'];
                                                            lng = data['0']['bucketlist'][0]['lng'];

                                                            var geocoder = new google.maps.Geocoder();
                                                            var myLatLng =  new google.maps.LatLng(lat, lng);

                                                            geocoder.geocode( {'latLng': myLatLng}, function(results, status) {
                                                                searchCoords = results[0].geometry.location;
                                                                searchCenter = new google.maps.LatLng(searchCoords.lat(), searchCoords.lng());
                                                                map.panTo(searchCenter);
                                                            });

                                                    };   
                                            };

                                            data_request.send(null);       
                                    };
                                });
                                
                        } else if (data_request.readyState == 4 && data_request.status != 200) {
                                alert("Failed to Load Data!");
                        }
                        
                };

                data_request.send(null);
            });
        });
    
}


function add_recommendations() {
        num = Math.floor(Math.random() * 10);

        locations = [];
        locations.push('Boston, MA');
        locations.push('New York, NY');
        locations.push('Paris, France');
        locations.push('London, Endland');
        locations.push('Cambridge, MA');
        locations.push('San+Francisco, CA');
        locations.push('Dallas, TX');
        locations.push('New Orleans, LA');
        locations.push('Philadelphia, PA');
        locations.push('Chicago, Il');
        locations.push('Nashville, TN');

        use_yelp(locations[num], "purple");

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': locations[num]}, function(results, status) {
            searchCoords = results[0].geometry.location;
            searchCenter = new google.maps.LatLng(searchCoords.lat(), searchCoords.lng());
            map.panTo(searchCenter);
        });
}

