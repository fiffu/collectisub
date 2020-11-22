# collectisub

    [x] grab subs
    [x] extract all M sentences
    [x] dump into database
    [ ] randomly allocate M/N sentences to each of N "translators"
    [ ] translators "translate" their share of sentences
    [ ] collate, export to srt/ass

WIP: https://collectisub.herokuapp.com


## Install

    npm install
    node server.js
    npm run live   // auto-reloads Node for dev

## Deploy

    heroku create
    heroku git:remote
    git push heroku master
    heroku open
