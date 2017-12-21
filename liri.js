// import { setTimeout } from "timers";


// call modules
var twitter = require("./keys.js");
var Twitter = require('twitter');



setTimeout(function () {

    if (liri.act === "post") {
        liri.post(liri.input)
    } else if (liri.act === "get") {
        liri.get(liri.input);
    }

}, 1000);


var liri = {
    // get args
    act: process.argv[2],
    input: process.argv[3],

    // create client object
    client: new Twitter({
        consumer_key: twitter.twitterKeys.consumer_key,
        consumer_secret: twitter.twitterKeys.consumer_secret,
        access_token_key: twitter.twitterKeys.access_token_key,
        access_token_secret: twitter.twitterKeys.access_token_secret,
    }),

    post: function (status) {
        liri.client.post("statuses/update", { status: status }, function (error, tweet, response) {
            if (!error) {
                console.log(tweet.text);

            } else {
                console.log(error)
            }
        });
    },
    get: function (search) {

        if (search) {

            liri.client.get('search/tweets', { q: search }, function (error, tweets, response) {

                console.log("TWEET HISTORY (NEWEST TO OLDEST)");

                for (let i = 0; i < tweets.statuses.length; i++) {

                    console.log("TWEET " + i + ": " + tweets.statuses[i].text);
                }
            });

        } else {

            liri.client.get('search/tweets', { q: 'notthebotuwant' }, function (error, tweets, response) {

                console.log("TWEET HISTORY (NEWEST TO OLDEST)");

                for (let i = 0; i < tweets.statuses.length; i++) {

                    console.log("TWEET " + i + ": " + tweets.statuses[i].text);
                }
            });
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