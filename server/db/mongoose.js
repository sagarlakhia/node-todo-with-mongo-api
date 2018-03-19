var mongoose = require('mongoose');
var dbcredentials = require('../dbcredentials');

mongoose.Promise = global.Promise;
console.log(dbcredentials.dbUsername);
//mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect(`mongodb://${dbcredentials.dbUsername}:${dbcredentials.dbPassword}@ds117729.mlab.com:17729/todoapp`)
module.exports = {mongoose};