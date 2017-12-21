// import { clearInterval } from "timers";

// import { setTimeout } from "timers";


// call modules
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require("node-spotify-api");
var fs = require("fs");
var request = require("request");



setTimeout(function () {

    switch (liri.mod) {

        case "twitter":

            switch (liri.act) {

                case "post":

                    liri.twitter.post(liri.input);
                    break;

                case "get":

                    liri.twitter.get(liri.input);
                    break;

                case "retweet":

                    console.log("test a");

                    if (liri.mode === "cont") {

                        console.log("test 0");

                        var retweet = function () {

                            console.log("test 1");

                            liri.twitter.retweet(liri.input);


                        }

                        var auto = setInterval(function () { console.log("test 2"); retweet() }, 10000);

                        setTimeout(function () { clearInterval(auto); console.log("timed out") }, 600000);
                        break;
                    }
                    break;

                case "stop":

                    clearInterval(retweet);
                    break;

                default:

                    liri.twitter.retweet(liri.input)
                    break;
            }
            break;

        case "spotify":

            switch (liri.act) {

                case "search":

                    liri.spotify.search(liri.input);
                    break;
            };
            break;
        case "movie-this":
            liri.movie.get(process.argv[3]);
            break;
    }

}, 1);


var liri = {

    // get args
    mod: process.argv[2],
    act: process.argv[3],
    input: process.argv[4],
    mode: process.argv[5],

    // twitter module
    twitter: {



        // create client object
        client: new Twitter({
            consumer_key: keys.twitterKeys.consumer_key,
            consumer_secret: keys.twitterKeys.consumer_secret,
            access_token_key: keys.twitterKeys.access_token_key,
            access_token_secret: keys.twitterKeys.access_token_secret,
        }),

        // posts to twitter
        post: function (status) {

            liri.twitter.client.post("statuses/update", { status: status }, function (error, tweet, response) {

                if (!error) {
                    console.log("Tweeted: " + tweet.text);

                } else {
                    console.log(error)
                }
            });
        },

        // search twitter
        get: function (search) {

            if (search) {

                liri.twitter.client.get('search/tweets', { q: search }, function (error, tweets, response) {

                    console.log("TWEET HISTORY (NEWEST TO OLDEST)");

                    for (let i = 0; i < tweets.statuses.length; i++) {

                        console.log("TWEET " + i + ": " + tweets.statuses[i].text);
                    }
                });

            } else {

                liri.twitter.client.get('search/tweets', { q: 'notthebotuwant' }, function (error, tweets, response) {

                    console.log("TWEET HISTORY (NEWEST TO OLDEST)");

                    for (let i = 0; i < tweets.statuses.length; i++) {

                        console.log("TWEET " + i + ": " + tweets.statuses[i].text);
                    }
                });
            }
        },

        // retweet tweets by search
        retweet: function (search) {

            liri.twitter.client.get('search/tweets', { q: search }, function (error, tweets, response) {

                console.log(tweets);

                for (let i = 0; i < tweets.statuses.length; i++) {

                    console.log("TWEET " + i + ": " + tweets.statuses[i].text);
                    console.log("TWEET ID " + i + ": " + tweets.statuses[i].id);



                    var tweetId = tweets.statuses[i].id_str;

                    liri.twitter.client.post("statuses/retweet/" + tweetId, function (error, tweet, response) {
                        if (!error) {
                            console.log("Tweeted: " + tweet.text);

                        } else {
                            console.log(error)
                        }
                    });
                }
            });
        }
    },

    // spotify module
    spotify: {

        // spotify object
        client: new Spotify({
            id: keys.spotifyKeys.id,
            secret: keys.spotifyKeys.secret
        }),

        search: function (search) {

            liri.spotify.client.search({
                type: "track",
                query: search,
            }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Song name: " + data.tracks.items[0].name);
                console.log("Album name: " + data.tracks.items[0].album.name);
                console.log("Link: " + data.tracks.items[0].external_urls.spotify);

            })
        }
    },

    // movie module
    movie: {

        get: function (search) {
            request('http://www.omdbapi.com/?apikey=trilogy&t=' + search, function(err, res, body){
                if (err) {
                    console.log(err);
                }

                console.log(body);
            })
        }

    }
}

console.log("liri initiated");


// switch (cmd) {

//     case "my-tweets":

//         break;

//     case "spotify-this-song":

//         break;


//     case "movie-this":

//         break;

//     case "do-what-it-says":

//         break;

// }