# liri-node-app
Liri has 4 modules:
  0: node liri.js twitter:
    stream - not reccomended, listens for activity, easy to rate cap, volume of responses varies by topic popularity
    post - posts to twitter... node liri.js twitter post "..."
    get - search for tweets... node liri.js twitter get "..."
    retweet - automated retweet functionality... node liri.js retweet "..."
    add - adds user by id
    followlisten - automatically listens for follows. when a follow occurs, follow them back
    fav - favs tweets by topic... node liri.js fav "..."
  1: node liri.js spotify-this-song "..."
  2: node liri.js movie-this "..."
  3: node liri.js do-what-it-says
