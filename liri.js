var twitter = require("./keys.js");

console.log(twitter);

var cmd = process.argv[2];

client.post("statuses/update", { status: 'I am a tweet' }, function (error, tweet, response) {
    if (!error) {
        console.log(tweet);
    }
});

switch (cmd) {

    case "my-tweets":

        break;

    case "spotify-this-song":

        break;


    case "movie-this":

        break;

    case "do-what-it-says":

        break;

}