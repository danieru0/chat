const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const Room = require('../models/room');

router.get('/', (req, res) => {
    if (req.user) {
        if (Object.keys(req.query).length === 0) {
            Room.find({}, (err, docs) => {
                if (!err) {
                    res.render('chat', {
                        username: req.user.username,
                        room: false,
                        allRooms: docs,
                    });
                }
            });
        } else {
            const roomQuery = req.query;
            const roomName = roomQuery.name;
            Room.findOne({ name: roomName }, (err, result) => {
                if (!err) {
                    if (result) {                        
                        Room.find({}, (err, docs) => {
                            if (!err) {
                                res.render('chat', {
                                    username: req.user.username,
                                    room: roomName,
                                    allRooms: docs,
                                    clickedRoom: result
                                });
                            }
                        });
                    } else {
                        res.render('404');
                    }
                }
            });
        }
    } else {
        res.redirect('/login');
    }
});

router.get('/make', (req, res) => {
    if (req.user) {
        res.render('make');
    } else {
        res.redirect('/login');
    }
});

router.post('/make', [
    check('name').matches(/^([0-9A-z\ \_]+)$/, 'g').isLength({ max: 24 }).withMessage("Max room name: 24, don't use special characters")
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('make', {
            errors: errors.mapped()
        });
    }
    let room = new Room();
    room.name = req.body.name;
    room.author = req.user.username;

    room.save((err) => {
        if (err) {
            console.log(err);
            return;
        }
    });
    res.redirect('/');
});

module.exports = router;