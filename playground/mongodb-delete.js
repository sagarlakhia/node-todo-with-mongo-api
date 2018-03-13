//const MongoClient = require('mongodb').MongoClient;
//Destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MondoDB server');

    //deleteMany
    // db.collection('Todos').deleteMany({
    //     text: 'Eat lunch'
    // }).then((result)=> {
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({
    //     text : 'Eat lunch'
    // }).then((result) => {
    //     console.log(result);
    // });

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed:false}).then((result) => {
    //     console.log(result);
    // })

    //Exercise
    //find one and delete with id
    // db.collection('Users').findOneAndDelete({_id: new ObjectID('5aa74646670dce02e9accf25')}).then((result) => {
    //     console.log('Deleted : ', result);
    // });

    //delete with name

    db.collection('Users').deleteMany({
        name:'Sagar Lakhia' 
    }).then((result) => {
        console.log(result);
    })

    //db.close();
});