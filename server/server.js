require('./config/config.js');

const _= require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var port = process.env.PORT;

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user');
var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    }).catch((e) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            statusCode: 200,
            todos
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            text: 'Invalid id'
        })
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            res.status(404).send({
                text: 'Nothing found'
            });
        }
        res.status(200).send(todo);
    }).catch((err) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            text: 'Invalid id'
        })
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            res.status(404).send({
                text: 'Nothing found'
            });
        }
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(404).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); //subset of things that user passed us
    if (!ObjectID.isValid(id)) {
        return res.sendStatus(404).send({
            text: 'Invalid id'
        })
    }
    if (_.isBoolean(body.completed) && body.completed) { 
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
           return res.sendStatus(404).send({
                text: 'Invalid entry'
            })
        }
        res.send({todo});
    }).catch((e) => {
        res.sendStatus(400).send();
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(res);

    user.save().then((usr) => {
        res.send(usr);
    },(err) => {
        res.send(400).send(err);
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};
