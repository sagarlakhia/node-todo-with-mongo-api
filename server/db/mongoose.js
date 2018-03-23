var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');
//mongoose.connect(`mongodb://todouser:todopassword@ds117729.mlab.com:17729/todoapp`)
module.exports = {mongoose};