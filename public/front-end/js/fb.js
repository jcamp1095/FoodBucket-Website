window.fbAsyncInit = function() {
        FB.init({
          appId      : '1030706586965286',
          xfbml      : true,
          version    : 'v2.6'
        });

        FB.getLoginStatus(function(response) {
          statusChangeCallback(response);
        });
};


// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
              'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log into Facebook';
    }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

    send_user_info();

}



function testAPI() {
    $(document).trigger('fbload'); 
    FB.api('/me', function(response) {
        document.getElementById('status').innerHTML =
        'Welcome, ' + response.name + '!';
    }); 
}