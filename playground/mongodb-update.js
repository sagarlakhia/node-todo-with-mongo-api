//const MongoClient = require('mongodb').MongoClient;
//Destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MondoDB server');

    //findOneAndUpdate

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5aa7523fc1e845d9ee3b7784')
    // }, {
    //     $set:{
    //         completed: true
    //     }
    // }, {
    //     returnOriginal:false
    // }).then((result) => {
    //     console.log(result);
    // });

    //Update name and decrease the age

    db.collection('Users').findOneAndUpdate({
        _id : new ObjectID('5aa0cbeec1243e061c3094eb')
    }, {
        $set: {
            name:'Sagar Lakhia'
        },
        $inc:{
            age:-10
        }}, {
            returnOriginal:false
        }).then((result) => {
        console.log(result);
    })

    //db.close();
});