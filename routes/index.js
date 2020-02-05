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
      console.log(err);
      return res.render('/register');
    }
    passport.authenticate('local')(req, res, () => {
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
  res.redirect('/cats');
});

// middleware
// logic is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
