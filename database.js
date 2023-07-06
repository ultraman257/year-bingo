const r = require('rethinkdbdash')({
    host: process.env.rethinkdb ? process.env.rethinkdb : '192.168.1.25',
    db: 'bingo2021'
}); // TODO: cloud server?

module.exports = r;
