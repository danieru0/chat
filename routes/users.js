const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');

router.get('/register', (req, res) => {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('register');
    }
});

router.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            return res.render('register', {
                failureMessage: err.message
            });
        }

        passport.authenticate('local')(req, res, () => {
            res.redirect('/');
        });
    });
});

router.get('/login', (req, res) => {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('login', {
            failureMessage: req.flash('error')
        });
    }
});

router.post('/login', passport.authenticate('local', {failureFlash: { type: 'error', message: 'Invalid username or password' }, failureRedirect: '/login'}), (req, res) => {
    res.redirect('/');
});

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;