# collectisub

    1. grab subs
    2. extract all M sentences, dump into database
    3. randomly allocate M/N sentences to each of N "translators"
    4. translators "translate" their share of sentences
    5. collate, export to srt/ass

collectisub.herokuapp.com


# Install

    npm install
    node index.js
    npm run live   // auto-reloads Node for dev

# Deploy

    heroku create
    heroku git:remote
    git push heroku master
    heroku open
