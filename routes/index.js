let express = require('express');
let router = express.Router();

const crypto = require('crypto')

let DiscordOauth2 = require('discord-oauth2');
const oauth = new DiscordOauth2({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirectUri: `${process.env.redirectUri}/authenticate`,
});


/* GET home page. */
router.get('/', function(req, res, next) {
  // Create discord login url
  const url = oauth.generateAuthUrl({
    scope: ["identify"],
    state: crypto.randomBytes(16).toString("hex"), // Be aware that randomBytes is sync if no callback is provided
  });

  res.render('index', { title: '2021 - Home', loginUrl: url });
});


module.exports = router;
