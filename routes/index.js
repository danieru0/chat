const express = require('express');
const router = express.Router();
const GlobalMessage = require('../models/global');

router.get('/', (req, res) => {
    if (req.user) {
        if (Object.keys(req.query).length === 0) {
            res.render('chat', {
                username: req.user.username,
                room: false
            });
        } else {
            const roomQuery = req.query;
            const roomName = roomQuery.name;
            res.render('chat', {
                username: req.user.username,
                room: roomName
            });
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;