const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var userId = '5aa9d83197ffafbc07dd08e011';

//TODO 

// var id = '5aa9f1d0c631c9320dc8a52311';

// if (!ObjectID.isValid(id)) {
//     console.log('Id is not valid');
// }
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('TodoFind', JSON.stringify(todos, undefined, 2));
// })

// //Returns only first doc
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('TodoFindOne', JSON.stringify(todo, undefined, 2));
// })

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('TodoById', JSON.stringify(todo, undefined, 2));
// }).catch((err) => {
//     console.log(err);
// });

//USER Challenge

if (!ObjectID.isValid(userId)) {
    return console.log('UserId not valid');
}
User.findById(userId).then((user) => {
    if (!user) {
        return console.log('User not found');
    }
    console.log(JSON.stringify(user, undefined, 2));
}).catch((err) => {
    console.log(err);
});