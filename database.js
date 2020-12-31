const r = require('rethinkdbdash')({
    host: process.env.rethinkdb ? process.env.rethinkdb : '127.0.0.1',
    db: 'bingo2021'
}); // TODO: cloud server?

module.exports = r;
