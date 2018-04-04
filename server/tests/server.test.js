const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
//Run test by npm run test-watch
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('Should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos').send({text})
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => {
                done(e);
            });
        })
    });
    
    it('Should not create todo with invalid body data', (done) => {
        
        request(app)
        .post('/todos').send({})
        .set('x-auth', users[0].tokens[0].token)
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => {
                done(e);
            });
        });
    });
});

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('Should return a todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('Should not return a todo doc created by other user', (done) => {
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        request(app)
        .get(`/todos/${(new ObjectID).toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })

    it('Should return 404 if invalid id', (done) => {
        request(app)
        .get('/todos/123')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })

});

describe('DELETE /todos/:id', () => {
    
    it('Should remove a todo', (done) =>{
        var hexId = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        }).end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

    it('Should not remove a todo created by another user', (done) =>{
        var hexId = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.findById(hexId).then((todo) => {
                expect(todo).toExist();
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

     it('Should return a 404 if a todo is not found', (done) => {
        request(app)
        .delete(`/todos/${(new ObjectID).toHexString()}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);        
     });

     it('Should return 404 if object id is invalid', (done) => {
        request(app)
        .delete(`/todos/${(new ObjectID).toHexString()}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);
     })
});

describe('PATCH /todos/:id', () => {
    it('Should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'This is new text';
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({
            completed: true,
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done)
    });

    it('Should not update the todo if different user', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'This is new text';
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
            completed: true,
            text
        })
        .expect(404)
        .end(done)
    });

    it('Should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var text = 'This is it !!';
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
            completed: false,
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });
});

describe('GET /users/me', () => {
    it('Should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('Should return 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users', () => {
    it('Should create a user', (done) => {
        var email = 'example@example.com'
        var password = '123mlb!'

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if (err) {
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            }).catch((err) => {
                done(err);
            })
        });
    });

    it('Should return validation error if request invalid', (done) => {
        var email = 'example@wassup.com';
        var password = 'pass';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });

    it('Should not create a user if email is already taken', (done) => {
        var email = users[0].email;
        var password = 'passwordsomething';
        request(app)
        .post('/users')
        .set({email, password})
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login', () => {

    it('Should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist()
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[1]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((err) => {
                done(err);
            })
        })
    })

    it('Should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: 'hey'
        })
        .expect(400)
        .expect((res) => [
            expect(res.headers['x-auth']).toNotExist()
        ])
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1)
                done();
            }).catch((err) => {
                done(err);
            });
        })
    });
});

describe('DELETE /users/me/token', () => {
    it('Should remove auth token on logout', (done) => {

        request(app)
        .delete('/users/me/token')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0)
                done();
            }).catch((err) => {
                done(err);
            })
        });
    });
    
})