const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
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

mongoose.connect('mongodb://localhost:27017/chatapp', {useNewUrlParser: true});

const server = app.listen(8080, () => {
    console.log('Server started on port 8080');
});

const io = socket(server);

const GlobalMessage = require('./models/global');

io.on('connection', (socket) => {
    socket.on('output', (data) => {
        if (data.room == false) {
            GlobalMessage.find({}, (err, docs) => {
                if (!err) {
                    io.sockets.emit('output', docs);
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
                io.sockets.emit('output', {
                    username: data.user,
                    message: data.message
                });
            });
        }
    });
});