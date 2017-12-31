
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

        screenName: "cat_retweets",

        // create client object
        client: new Twitter({
            consumer_key: keys.twitterKeys.consumer_key,
            consumer_secret: keys.twitterKeys.consumer_secret,
            access_token_key: keys.twitterKeys.access_token_key,
            access_token_secret: keys.twitterKeys.access_token_secret,
        }),

        stream: function (search) {

            // c: pls limit requests
            liri.twitter.client.stream('statuses/filter', { track: search }, function (stream) {
                stream.on('data', function (error, tweets) {
                    // console.log(event);
                    if (error) {
                        console.log(error);
                        return
                    } else {
                        // console.log(tweets);



                        console.log("TWEET: " + tweets.statuses[0].text);
                        console.log("TWEET ID: " + tweets.statuses[0].id);



                        var tweetId = tweets.statuses[0].id_str;

                        liri.twitter.client.post("statuses/retweet/" + tweetId, function (error, tweet, response) {
                            if (!error) {
                                liri.twitter.add(tweet.retweeted_status.user.screen_name);
                                console.log("_Tweeted: " + tweet.id_str);
                                liri.twitter.client.post("favorites/create", { id: tweet.retweeted_status.id_str }, function (err) {
                                    if (!error) {
                                        console.log("___Faved: " + tweet.id_str);

                                    } else {
                                        console.log(error)
                                    }
                                });

                            } else {
                                console.log("test");
                                // test();
                                console.log(error)
                            }
                        });
                    }

                    // liri.twitter.add(event)
                    // var id = event.id_str;
                    // // liri.twitter.fav(id);
                    // liri.twitter.client.post("favorites/create", { id: id }, function (err) {
                    //     if (err) {
                    //         console.log(err);
                    //         return;
                    //     } else {
                    //         console.log("tweet: " + id + " favorited")
                    //     }
                    // })
                    // return;
                })


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

                liri.twitter.client.get('search/tweets', { q: search, count: 1 }, function (error, tweets, response) {

                    console.log("TWEET HISTORY (NEWEST TO OLDEST)");

                    for (let i = 0; i < tweets.statuses.length; i++) {

                        console.log("TWEET " + i + ": " + tweets.statuses[i].text);
                    }
                });

            } else {

                liri.twitter.client.get('search/tweets', { q: 'notthebotuwant' }, function (error, tweets, response) {
                    if (error) {
                        console.log(error);
                        return
                    }

                    console.log("MY TWEET HISTORY (NEWEST TO OLDEST)");

                    for (let i = 0; i < tweets.statuses.length; i++) {

                        console.log("TWEET " + i + ": " + tweets.statuses[i].text);
                    }
                });
            }
        },

        // retweet tweets by search
        retweet: function (search) {

            setInterval(function test() {
                var tweetId = "";
                liri.twitter.client.get('search/tweets', { q: search, count: 1, result_type: "mixed", lang: "en" }, function (error, tweets, response) {
                    if (error) {
                        console.log(error);
                        return
                    } else if (!error) {

                        if (!tweets.statuses[0]) {
                            console.log(" ");
                            console.log("-------------");
                            console.log("no tweet err");
                            console.log("-------------");
                            console.log(" ");
                            return
                        } else {

                            // console.log(tweets.statuses[0].entities);

                            if (!tweets.statuses[0].entities.media) {
                                if (!tweets.statuses[0].retweeted_status) {
                                    console.log("failed");
                                    console.log("no img");
                                    return
                                } else {

                                    console.log("retweet");
                                    tweetId = tweets.statuses[0].retweeted_status.id_str;
                                }
                            } else {

                                tweetId = tweets.statuses[0].id_str;
                            }

                            console.log("TWEET: " + tweets.statuses[0].text);
                            console.log("TWEET ID: " + tweets.statuses[0].id);





                            liri.twitter.client.post("statuses/retweet/" + tweetId, function (error, tweet, response) {
                                if (!error) {
                                    // liri.twitter.add(tweet.retweeted_status.user.screen_name);
                                    console.log("_Tweeted: " + tweet.id_str);
                                    liri.twitter.client.post("favorites/create", { id: tweet.retweeted_status.id_str }, function (err) {
                                        if (!error) {
                                            console.log("___Faved: " + tweet.id_str);

                                        } else {
                                            console.log(error)
                                        }
                                    });

                                } else {
                                    console.log("test");

                                    console.log(error)
                                }
                            });
                        }
                    } else {
                        console.log("????");
                        return
                    }
                });
            }, 1000 * 60 );
        },

        add: function (user) {


            liri.twitter.client.post("friendships/create", { screen_name: user }, function (err, response) {
                if (err) {
                    console.log(err)
                }

                console.log(user + " is now followed!");
            })

        },

        addSuggested: function () {

            setTimeout(function () {
                liri.twitter.client.get('users/suggestions/digital-creators', function (err, data) {
                    if (err) {
                        console.log(err)
                    }

                    var rng = Math.floor(Math.random() * data.users.length);
                    console.log(rng);
                    liri.twitter.add(data.users[rng]);

                })
            }, 1000);

        },

        followListen: function () {
            var stream = liri.twitter.client.stream('user');
            stream.on('follow', followed);
            function followed(event) {
                console.log("follow detected")
                var name = event.source.screen_name;
                if (name != liri.twitter.screenName) {

                    setTimeout(function () { liri.twitter.post("@" + name + " Thanks for following!") }, 1000 * 30);
                    liri.twitter.add(name);
                    console.log(name + " followed!");
                } else {
                    console.log("done");
                    return
                }
            }

        },

        fav: function (search) {
            liri.twitter.client.get("search/tweets", { q: search, count: 1, result_type: "mixed" }, function (error, tweets, response) {
                if (error) {
                    console.log(error)
                }
                var favCount = tweets.statuses[0].favorite_count;
                var reTweets = tweets.statuses[0].retweet_count;
                var tweetId = tweets.statuses[0].id_str;
                var tweetext = (tweets.statuses[0].text);
                console.log(tweetext);
                var id = (tweets.statuses[0].id_str);
                if (reTweets > 5 || favCount > 30) {
                    console.log("TWEET ID: " + tweetId);


                    liri.twitter.client.post("favorites/create", { id: id }, function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {

                            console.log("tweet: " + tweetext + " favorited")
                        }
                    });


                    liri.twitter.client.post("statuses/retweet/" + tweetId, function (error, tweet, response) {
                        if (!error) {
                            console.log("Tweeted: " + tweet.text);

                        } else {
                            console.log(error)
                        }
                    });
                } else if (search) {
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

// setInterval(function () { liri.twitter.fav("swiftonsecurity") }, (1000 * 60) * 60);
// setInterval(function () { liri.twitter.fav("javascript") }, (1000 * 60) * 30);
// setInterval(function () { liri.twitter.fav("cat"); console.log ("cat search" )}, (1000 * 60) * 1);
// setInterval(function () {
//     liri.twitter.client.get("search/tweets", { q: "kitten", count: 1, result_type: "popular" }, function (error, tweets, response) {
//         if (error) {
//             console.log(error)
//         }
//         var favCount = tweets.statuses[0].favorite_count;
//         var reTweets = tweets.statuses[0].retweet_count;
//         var tweetId = tweets.statuses[0].id_str;
//         var tweetext = (tweets.statuses[0].text);
//         var id = (tweets.statuses[0].id_str);
//         if (reTweets > 5 || favCount > 30) {
//             console.log("TWEET ID: " + tweetId);





//             liri.twitter.client.post("statuses/retweet/" + tweetId, function (error, tweet, response) {
//                 if (!error) {
//                     console.log("Tweeted: " + tweet.text);

//                 } else {
//                     console.log(error)
//                 }
//             });
//         };
//         if (search) {
//             liri.twitter.client.post("favorites/create", { id: id }, function (err) {
//                 if (err) {
//                     console.log(err);
//                     return;
//                 } else {

//                     console.log("tweet: " + tweetext + " favorited")
//                 }
//             })

//         }
//     })
// }, (1000 * 60) * 50);
// // liri.twitter.addSuggested();
console.log("liri initiated");

liri.twitter.followListen();





