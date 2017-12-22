// import { clearInterval } from "timers";

// import { setTimeout } from "timers";


// call modules
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require("node-spotify-api");
var fs = require("fs");
var request = require("request");
var moment = require('moment');



setTimeout(function () {

    liri.eval();

}, 1);


var liri = {

    // get args
    mod: process.argv[2],
    act: process.argv[3],
    input: process.argv[4],
    mode: process.argv[5],

    eval: function (arg0, arg1) {


        if (arg0) {
            liri.mod = arg0;
        }

        if (arg1) {
            liri.input = arg1;
        }

        switch (liri.mod) {

            case "twitter":

                switch (liri.act) {

                    // node liri.js twitter post
                    case "post":

                        liri.twitter.post(liri.input);
                        break;

                    // node liri.js twitter get
                    case "get":

                        liri.twitter.get(liri.input);
                        break;

                    // node liri.js twitter get
                    case "fav":
                        if (process.argv[5]) {
                            var timed = setInterval(function () { liri.twitter.fav(liri.input) }, 1000 * 5);
                            setTimeout(function () { clearInterval(timed) }, 1000 * process.argv[5]);
                        } else {
                            liri.twitter.fav(liri.input);
                        }
                        break;
                    // node liri.js twitter retweet
                    case "retweet":

                        if (liri.mode === "cont") {

                            var retweet = function () {
                                liri.twitter.retweet(liri.input);
                            }

                            var auto = setInterval(function () { console.log("test 2"); retweet() }, 10000);

                            setTimeout(function () { clearInterval(auto); console.log("timed out") }, 600000);
                            break;

                        } else {

                            liri.twitter.retweet(liri.input);
                        }
                        break;
                    // node liri.js twitter stream
                    case "stream":

                        if (liri.input) {

                            liri.twitter.stream(liri.input);
                        } else {

                            liri.twitter.stream();
                        }
                        break;

                    default:

                        liri.twitter.retweet(liri.input)
                        break;
                };
                break;

            case "spotify-this-song":

                if (arg1) {
                    console.log("test");
                    liri.spotify.search(arg1);
                } else {
                    liri.spotify.search(process.argv[3]);
                }
                break;

            case "movie-this":

                if (arg1) {
                    liri.movie.get(arg1);
                }
                liri.movie.get(process.argv[3]);
                break;
            case "do-what-it-says":

                liri.exe.do();
                break;

        }
    },

    // twitter module
    twitter: {

        screenName: "notthebotuwant",

        // create client object
        client: new Twitter({
            consumer_key: keys.twitterKeys.consumer_key,
            consumer_secret: keys.twitterKeys.consumer_secret,
            access_token_key: keys.twitterKeys.access_token_key,
            access_token_secret: keys.twitterKeys.access_token_secret,
        }),

        stream: function (search) {

            // You can also get the stream in a callback if you prefer. 
            liri.twitter.client.stream('statuses/filter', { track: search }, function (stream) {
                stream.on('data', function (event) {
                    console.log(event.id);
                    var id = event.id_str;
                    // liri.twitter.fav(id);
                    liri.twitter.client.post("favorites/create", { id: id }, function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            console.log("tweet: " + id + " favorited")
                        }
                    })
                    return;
                });

                stream.on('error', function (error) {
                    throw error;
                });
            });
        },

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

                    console.log("MY TWEET HISTORY (NEWEST TO OLDEST)");

                    for (let i = 0; i < tweets.statuses.length; i++) {

                        console.log("TWEET " + i + ": " + tweets.statuses[i].text);
                    }
                });
            }
        },

        // retweet tweets by search
        retweet: function (search) {

            liri.twitter.client.get('search/tweets', { q: search }, function (error, tweets, response) {

                // console.log(tweets);

                for (let i = 0; i < 1; i++) {

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
        },

        add: function (user) {

            liri.twitter.client.post("friendships/create", { screen_name: user }, function (err, response) {
                if (err) {
                    console.log(err)
                }

                console.log(user + " is now followed!");
            })

        },

        followListen: function () {
            var stream = liri.twitter.client.stream('user');
            stream.on('follow', followed);
            function followed(event) {
                var name = event.source.screen_name;
                if (name != liri.twitter.screenName) {
                    console.log(name + " followed!");
                    liri.twitter.post("@" + name + " Thanks for following!");
                    liri.twitter.add(name);
                } else {
                    console.log("done");
                    return
                }
            }

        },

        fav: function (search) {
            liri.twitter.client.get("search/tweets", { q: search }, function (error, tweets, response) {
                var tweetext = (tweets.statuses[0].text);
                var id = (tweets.statuses[0].id_str);
                if (search) {
                    liri.twitter.client.post("favorites/create", { id: id }, function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            console.log("tweet: " + tweetext + " favorited")
                        }
                    })

                }
            })
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

            request('http://www.omdbapi.com/?apikey=trilogy&t=' + search, function (err, res, body) {

                if (err) {
                    console.log(err);
                }

                var response = JSON.parse(body);

                console.log("-----------------------------------------");
                console.log("Title: " + response.Title);
                console.log("Released: " + response.Year);
                console.log("IMDB Rating: " + response.imdbRating);
                console.log("Rotten Tomatos Rating: " + response.Ratings[1].Value);
                console.log("Produced in: " + response.Country);
                console.log("Language: " + response.Language);
                console.log("Plot: " + response.Plot);
                console.log("Actors: " + response.Actors);
                console.log("-----------------------------------------");
            })
        }

    },

    exe: {

        do: function () {

            fs.readFile("random.json", "utf8", function (err, data) {
                if (err) {
                    console.log(err);
                }

                var res = JSON.parse(data);
                // var res = data.split(",");
                for (let i = 0; i < res.actions.length; i++) {

                    var action = res.actions[i].action;
                    console.log(action);

                    var input = res.actions[i].input;
                    console.log(input);
                    liri.eval(action, input);
                }

            })

        }
    },



};

liri.twitter.followListen();

console.log("liri initiated");



