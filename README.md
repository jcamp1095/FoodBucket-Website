## Group #22
## By: Vincent Tsang, Joe Cambell, Kevin Galasso, and Morgan Ciliv
## Spring 2015 Semester Group Project: Food and Dietary
## Date: 8 March 2016
________________________________________________________________________________


						Project Title: Food Bucket
											  
________________________________________________________________________________

	---Problem Statement---

The problem that food bucket solves is finding a restaurant to go to and making it happen! Dining out is one of the best ways to socialize. Making the process of getting started easier, people will be more likely to go out.

Food Bucket is a website designed to help you, your friends, colleagues, or family members build bucket lists of restaurants to go to. For the group setting, friends can collaborate on which restaurant to go to. The website helps prioritize your favorite choices so that a decision can be made more easily. Once a decision is made, the website books you a time and notify's you of the upcoming event. Turn your dining into a group adventure!



	---How the Problem will be Solved---

Food Bucket allows the user to search for restaurants through a search function that can help the user select a restaurant by geolocation, price, or ratings. Restaurants can be added to one of your "bucket lists". Users are also able to create "groups" where bucket lists can be shared and planned together with multiple friends. Food Bucket also gives recommendations based on restaurants near them. 



	---Features to be Implemented---

-Geolocation: Find restaurants and other food joints
-Server-side data persistence: Bucket lists, Group Bucketlists
-Front-end framework: Bootstrap
-Send emails or push notifications: Confirmation/Recommendation Emails
-client-side data persistance: Pulling restaurant reviews from Yelp and using Google Maps



	---What Data We Will Prototype, Use, and Collect---

-Restaurant information: Locations, reviews, prices, cuisine
-User's personal bucket lists and group lists
-User's restaurant preference for making the group list
-User's Facebook Friends
-User's email and desired password



	---Algorithms or Special Techniques to be Implemented---

-Search algorithm that will search for the correct restaurant based off of the user's desired category such as location, reviews, prices, and cuisine
-Algorithm that identifies if there is an overlap in group member's shedules so that available times to go can be displayed to the members. This algorithm will loop through each of the member's available times and will use one of the members schedules as the original and as its looping through will cut from that the users schedule until the overlap off each of the members schedules remain.
-Dequeue and enqueue algorithms for the priority queue data structure as defined below
-Data Structure to be used for the bucketlist: Priority Queue based off of the user's rating of their desire to go there.


Electronic mockups of what your team will be developing using wireframes. No hand-drawn mockups accepted. Tools to create wireframes include Balsamiq (commercial; de facto standard), Gliffy, MockFlow, and even Microsoft PowerPoint.


	---Usage and Functionality---

The application works when location services are turned on for the browser. Based on our experience, to get the best performance, please use the Firefox web browser or manually turn on locations for Google Chrome. 

In order to use the application, first log into Facebook. To add restaurants to the bucketlist, search a city and state in the search box and hit enter. The top twenty restaurants in the city will appear as markers. Click the markers to show an infowindow, then you can send a recommendation to a friend or click the add button to add the restaurant to your list. 

To view your bucket list, hover over the retaurants text of the sidebar. Selecting "restaurants" will display all restaurants in the bucketlist on the map. Selecting individual restaurants will cause only that restaurant to appear on the map.

Users can also add friends, which are users currently using the application. To add a friend, click the add friend button on the side. A modal will pop up and simply click the friend you wish to add. If you hover over the friends text on the side bar, the list of friends will pop up. Selecting the friend(s) wil cause their bucketlist restaurants to appear on the map. 

Users may also hit the recommendations button on the sidebar to view top restaurants in popular cities.
 
For mobile users, we made our

To Fix in the future: 

Some markers have bugs and do not allow users to add them to the restaurants. We suspect this may be due to some yelp properties that are null. 

---Time Spent---

We spent 40+ hours working on this applications 


#Comments by Ming
* In the future, please do not use pretty pictures on wireframes.  Know why?  So is this idea like Pinterest but for food? (the bucket idea made me think of Pinterest)
* 15/15



## End of README.md
