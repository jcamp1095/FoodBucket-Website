var myLat = 0;
var myLng = 0;
var data;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);

var myOptions = {
    zoom: 13, // The larger the zoom number, the bigger the zoom
    center: me,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};
//fdsakjrewkljrlkwe
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var my_list;
var id;

// Yelp API Set Up --- Begin
function use_yelp(loc) {
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
                setMarker(data['businesses'][i]);
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

                    send_user_info();
                    use_yelp(loc);

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


function setMarker(object)
{
        latit = object['location']['coordinate']['latitude'];
        longit = object['location']['coordinate']['longitude'];
        var curr_loc = new google.maps.LatLng(latit, longit);
        var marker = new google.maps.Marker({
                position: curr_loc,
                map: map,
                title: object.name
        });
                
        google.maps.event.addListener(marker, 'click', function() {

                var message = "<b>Name: </b>" + object['name'] + "<BR><b>Phone Number: </b>" + 
                    object['display_phone'] + "<BR><b>Yelp Rating (out of 5): </b>" + object['rating'] + 
                    "<BR><b>Address: </b>" + object['location']['display_address'] + 
                    "<BR><b>Categories: </b>" + object['categories'] +"<BR><a href=" + object['url'] + ">go to yelp </a>" + 
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
                                for (i = 0; i < data['bucketlist'].length; i++) {
                                        set_list_Marker(data['bucketlist'][i]);
                                }
                                
                        } else if (data_request.readyState == 4 && data_request.status != 200) {
                                alert("Failed to Load Data!");
                        }
                };

                data_request.send(null);
        });


}


function set_list_Marker(object)
{
        latit = object['lat'];
        longit = object['lng'];

        var curr_loc = new google.maps.LatLng(latit, longit);
        var marker = new google.maps.Marker({
                position: curr_loc,
                map: map,
                title: object.restaurant
        });
                
        google.maps.event.addListener(marker, 'click', function() {

                var message = "<b>Name: </b>" + object['restaurant'] + "<BR><b>Phone Number: </b>" + 
                    object['phone'] + "<BR><b>Yelp Rating (out of 5): </b>" + object['ratings'] + 
                    "<BR><b>Website: </b>" + object['website'];

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

