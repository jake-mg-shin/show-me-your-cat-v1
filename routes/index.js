const express = require('express'),
  router = express.Router(),
  passport = require('passport');

const User = require('../models/user.js');

// root route
router.get('/', (req, res) => {
  res.render('landing');
});

// ===========
// auth routes
// ===========

// show the register form
router.get('/register', (req, res) => {
  res.render('register');
});

// handle sign up logic
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Hi, ' + user.username);
      res.redirect('/cats');
    });
  });
});

// show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// handle login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/cats',
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.send('login');
  }
);

// logout route
router.use('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged it out!');
  res.redirect('/cats');
});

module.exports = router;
