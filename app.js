const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const socket = require('socket.io');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'chat app',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

const users = require('./routes/users');
const index = require('./routes/index');
app.use('/', index);
app.use('/', users);

const User = require('./models/users');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://elosik:Barbarakobuszewska123!@ds249311.mlab.com:49311/chatapp', {useNewUrlParser: true});

const server = app.listen(process.env.PORT || 8080, () => {
    console.log('Server started on port 8080');
});

const io = socket(server);

const GlobalMessage = require('./models/global');
const Room = require('./models/room');

io.on('connection', (socket) => {
    socket.on('remove', (data) => {
        Room.findOne({ name: data.room }, (err, docs) => {
            if (!err) {
                if (docs) {
                    if (docs.author == data.user) {
                        Room.deleteOne({ name: data.room }, (err) => {
                            if (!err) {
                                io.to(data.room).emit('remove');
                            }
                        });
                    }
                } else {
                    return;
                }
            }
        });
    });

    socket.on('output', (data) => {
        if (data.room == false) {
            GlobalMessage.find({}, (err, docs) => {
                if (!err) {
                    socket.join(data.room);
                    io.to(data.room).emit('output', docs);
                }
            });
        } else { 
            Room.findOne({ name: data.room }, (err, docs) => {
                if (!err) {
                    socket.join(data.room);
                    io.to(data.room).emit('output', docs.messages);
                }
            });
        }
    });

    socket.on('chat', (data) => {
        if (data.room == false) {
            let message = new GlobalMessage();
            message.username = data.user;
            message.message = data.message;

            message.save((err) => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            io.to(data.room).emit('output', {
                username: data.user,
                message: data.message
            });
        } else {
            Room.findOne({ name: data.room }, (err, result) => {
                if (!err) {
                    if (result) {
                        result.messages.push({
                            username: data.user,
                            message: data.message
                        });
                        result.save((err) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                        io.to(data.room).emit('output', {
                            username: data.user,
                            message: data.message,
                            room: data.room
                        });
                    }
                }
            });
        }
    });
});

app.get('*', (req, res) => {
    res.render('404');
});