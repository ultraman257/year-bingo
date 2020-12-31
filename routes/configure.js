let express = require('express');
let router = express.Router();

let DiscordOauth2 = require('discord-oauth2');
const oauth = new DiscordOauth2({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    redirectUri: `${process.env.redirectUri}/authenticate`,
});

const r = require('../database');

/* GET home page. */
router.get('/card', function(req, res, next) {


    if(req.cookies.hasOwnProperty('kid')) {

        let sessionData
        r.table('sessions').filter({ sessionId: req.cookies.kid}).then(result => {

            if(result > 0) {
                res.clearCookie('kid');
                return res.redirect('/')
            }

            // Shortcut, cba doing anything else
            sessionData = result[0];

            r.table('cards').filter({ userId: result.discordId}).then(result => {

                let bingoCard = result.length > 0 ? result[0].bingoCard : [];

                res.render('card', { title: '2021 - Bingo', displayName: `${sessionData.username}#${sessionData.discriminator}`, bingo: bingoCard });

            })



        })


    } else {
        return res.redirect('/login')
    }


});

router.post('/card', function (req, res) {

    let sessionData;

    if(req.cookies.hasOwnProperty('kid')) {

        r.table('sessions').filter({ sessionId: req.cookies.kid}).then(result => {
            // Shortcut, cba doing anything else
            sessionData = result[0];

            r.table('cards').filter({ userId: sessionData.discordId}).then(result => {

                if(result.length > 0) r.table('cards').filter({ userId: sessionData.discordId}).delete().run();

                r.table('cards').insert({ userId: sessionData.discordId, displayName: sessionData.username, bingoCard: bingoArray }).then(result => {
                    res.render('card', { title: '2021 - Bingo', displayName: `${sessionData.username}#${sessionData.discriminator}`, bingo: bingoArray });
                })


            })



        })


    }

    let bingoArray = [];

    bingoArray[0] = req.body['bingo-1'] ? req.body['bingo-1'] : '';
    bingoArray[1] = req.body['bingo-2'] ? req.body['bingo-2'] : '';
    bingoArray[2] = req.body['bingo-3'] ? req.body['bingo-3'] : '';
    bingoArray[3] = req.body['bingo-4'] ? req.body['bingo-4'] : '';
    bingoArray[4] = req.body['bingo-5'] ? req.body['bingo-5'] : '';
    bingoArray[5] = req.body['bingo-6'] ? req.body['bingo-6'] : '';
    bingoArray[6] = req.body['bingo-7'] ? req.body['bingo-7'] : '';
    bingoArray[7] = req.body['bingo-8'] ? req.body['bingo-8'] : '';



    console.log(bingoArray)

})


router.get('/authenticate', function(req, res) {

    if(!req.query.hasOwnProperty('code')) return res.render('error', { title: '2021 - Error', message: 'The request was invalid. Please try again.'})

    oauth.tokenRequest({
        code: req.query.code,
        scope: "identify",
        grantType: "authorization_code"
    }).then(result => {

        let token = require('crypto').randomBytes(64).toString('hex');

        res.cookie('kid', token)

        oauth.getUser(result.access_token).then(result => {

            r.table('sessions').insert({ sessionId: token, username: result.username, discriminator: result.discriminator, discordId: result.id}).then(result => {
                res.redirect('/card')
            })

        })

    }).catch(error => {
        console.log(error)
    })

});

router.get('/logout', function(req, res) {

    if(req.cookies.hasOwnProperty('kid')) {
        r.table('sessions').filter({ sessionId: req.cookies.kid}).delete().then(result => {
            res.clearCookie('kid');
            return res.redirect('/');
        })
    } else {
        res.redirect('/')
    }

})


module.exports = router;
