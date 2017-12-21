// import { setTimeout } from "timers";


// call modules
var twitter = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require("node-spotify-api");
var fs = require("fs");



setTimeout(function () {

    if (liri.mod === "twitter") {

        if (liri.act === "post") {
            liri.twitter.post(liri.input)
        } else if (liri.act === "get") {
            liri.twitter.get(liri.input);
        } else if (liri.act === "retweet") {
            liri.twitter.retweet(liri.input)
        }
    } else if (liri.mod === "spotify") {
        if (liri.act === "search") {
            liri.spotify.search(liri.input)
        }
    }

}, 1);


var liri = {

    // get args
    mod: process.argv[2],
    act: process.argv[3],
    input: process.argv[4],

    // twitter module
    twitter: {



        // create client object
        client: new Twitter({
            consumer_key: twitter.twitterKeys.consumer_key,
            consumer_secret: twitter.twitterKeys.consumer_secret,
            access_token_key: twitter.twitterKeys.access_token_key,
            access_token_secret: twitter.twitterKeys.access_token_secret,
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
            id: "b38f6fd97cc148c99b34e535e92ff2c3",
            secret: "da417e956f93441991a4f10e3aecca8f"
        }),

        search: function (search) {

            liri.spotify.client.search({
                type: "track",
                query: search,
            }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log(data);
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