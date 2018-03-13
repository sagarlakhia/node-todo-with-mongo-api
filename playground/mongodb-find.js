//const MongoClient = require('mongodb').MongoClient;
//Destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MondoDB server');

    // db.collection('Todos').find(
    // {_id:new ObjectID('5aa74a54c1e845d9ee3b747b')
        
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Enable to fetch todos', err);
    // });

    //To count the number of records
    // db.collection('Todos').find().count().then((count) => {
    //         console.log('Todos');
    //         console.log('Todos Count :', count);
    //         //console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => {
    //         console.log('Enable to fetch todos', err);
    //     });
    
    db.collection('Users').find({
        name:'Sagar Lakhia'
    }).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err)=> {
        console.log("error quering database")
    });

    //db.close();
});