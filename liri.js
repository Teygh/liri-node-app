// This is the Code for an APP called LIRI.
// LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.




require("dotenv").config(); /// Connection to the .env File. This file holds the API KEy and ID for Twitter & Spotify.

var keys = require("./keys.js"); /// Link to keys.js file which hold the formulation for the twitter & spotify Keys.
var Spotify = require("node-spotify-api"); /// Link to node-Spotify-api npm  https://www.npmjs.com/package/node-spotify-api
var twitter = require("twitter"); /// Link to twitter npm Package https://www.npmjs.com/package/twitter
var fs = require("fs"); /// Link to File System Module on the computer,
var request = require("request"); /// Link to request npm Package https://www.npmjs.com/package/require 




// The way that this app works is as follows:
// User makes a call from the command prompt, the user can make the following calls and each call will give the following results.

//1- Twitter Call [Types: node liri.js my-tweets] - The response should be: This will show your last 20 tweets and when they were created at in your terminal/bash window.

//2- Song Call - [Types: node liri.js spotify-this-song '<song name here>'] - This will show the following information about the song in your terminal/bash window
//  * Artist(s)
//  * The song's name
//  * A preview link of the song from Spotify
//  * The album that the song is from
// If no song is provided then your program will default to "The Sign" by Ace of Base.

//3- Movie Call - [Types: node liri.js movie-this '<movie name here>'`]


//To Solve this a Switch case will be used

//A. Capture the user Input 

var action = process.argv[2];
var value = process.argv[3];
calls();

function calls () {
    switch (action) {

        case "my-tweets":
            twitterCall();
            break;

        case "spotify-this-song":
            spotifyCall();
            break;

        case "movie-this":
            movieCall();
            break;

        case "do-what-it-says":
            doWhatItSays();
            
            break;

    }

}



//-------------------------- Functions for Each Request made by the User ----------------------------------------------------------

// 1- The  Twitter section; -------------------------------------------------------------------------------------------------------
// What should it do? - When the user writes the  following in the terminal LIRI must provide the last 20 tweets by this  user.

function twitterCall() {

    var client = new twitter(keys.twitter); // Link to the Keys folder that has the ID & API required to make an API call to twitter
    var TwitterUserName = 'Ibra_official';

    var client = new twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    //   console.log(client);

    var params = {
        screen_name: TwitterUserName,


    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {

            for (var i = 0; i < 20; i++) {
                console.log("Tweet " + i + ": " + "\nCreated on: " + tweets[i].created_at);
                console.log(tweets[i].text)
            }
        }

    });
}


// 2- The  Spotify  section; -------------------------------------------------------------------------------------------------------
// What should it do? - When the user writes the  following `node liri.js spotify-this-song '<song name here>'` we should get 
// * This will show the following information about the song in your terminal/bash window
// * Artist(s)

// * The song's name

// * A preview link of the song from Spotify

// * The album that the song is from

// * If no song is provided then your program will default to "The Sign" by Ace of Base.




function spotifyCall() {

    var spotify = new Spotify(keys.spotify); // Link to the Keys folder that has the ID & API required to make an API call to Spotify
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });

    if (value === undefined) {
        songName = "The Sign";
    } else {
        songName = value;
    }

    spotify



        .search({
            type: 'track',
            query: songName
        })
        .then(function (data) {
            // console.log(data.tracks);
            console.log("Song Name is: " + songName.toUpperCase());

            var artists;

            for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
                if (i > 0) {
                    artists += ", " + data.tracks.items[0].artists[i].name;
                } else {
                    artists = data.tracks.items[0].artists[i].name;
                }
            }

            console.log("The Artist(s): " + artists);
            console.log("The Album Name is: " + data.tracks.items[0].album.name);
            console.log("The Priview Link is: " + data.tracks.items[0].preview_url);




        })
        .catch(function (err) {
            console.log(err);
        });

}


// 3. `node liri.js movie-this '<movie name here>' ----------------------------------------------------------------------------------------------

//    * This will output the following information to your terminal/bash window:

//      ```
//        * Title of the movie.
//        * Year the movie came out.
//        * IMDB Rating of the movie.
//        * Rotten Tomatoes Rating of the movie.
//        * Country where the movie was produced.
//        * Language of the movie.
//        * Plot of the movie.
//        * Actors in the movie.
//      ```

//    * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

//      * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>

//      * It's on Netflix!

//    * You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use `trilogy`.
function movieCall() {



    // // Store all of the arguments in an array


    // Create an empty variable for holding the movie name
    var movieName = "";

    if (value == undefined) {
        var movieName = "Mr. Nobody";
    } else {
        var nodeArgs = process.argv;

        for (var i = 3; i < nodeArgs.length; i++) {

            if (i > 3 && i < nodeArgs.length) {

                movieName = movieName + "+" + nodeArgs[i];

            } else {

                movieName += nodeArgs[i];

            }
        }
    }

    // console.log(movieName);
    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s


    // console.log(movieName);
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);

    if (movieName != "Mr. Nobody") {

        request(queryUrl, function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {

                // console.log(body);

                // Parse the body of the site and recover just the imdbRating
                // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
                console.log("Tiltel of the Movie: " + JSON.parse(body).Title);
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("It was made in: " + JSON.parse(body).Country);
                console.log("Language(s): " + JSON.parse(body).Language);
                console.log("Movie Plot: " + JSON.parse(body).Plot);
                console.log("Actor(s): " + JSON.parse(body).Actors);

            }
        });

    } else {
        console.log("If you haven't watched Mr. Nobody,then you should: <http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }

}

function doWhatItSays() {

    fs.readFile('random.txt', 'utf8', function (err, data) {

        if (err) {
            console.log(err);
        }
        var text = [];
        text = data.split(",");
        console.log(data)

        console.log(text);
        
        for (var i = 0; i<text.length; i++){
            if (text[i] === "spotify-this-song"){
                value = text[i+1];
                action = "spotify-this-song"
                calls();
            }

        }

    });

}
            

    


