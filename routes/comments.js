const express = require('express'),
  router = express.Router({ mergeParams: true }); // make req.params.id to work: mergeParams: true

const Cat = require('../models/cat.js'),
  Comment = require('../models/comment.js');

// ===============
// comments routes
// ===============

// new comment
router.get('/new', isLoggedIn, (req, res) => {
  // find cat by id
  // req.params.id not working
  Cat.findById(req.params.id, (err, cat) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { cat: cat });
    }
  });
});

// create comment
router.post('/', isLoggedIn, (req, res) => {
  // lookup cats by id
  Cat.findById(req.params.id, (err, cat) => {
    if (err) {
      console.log(err);
      // when get err, go to back
      res.redirect('/cats');
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;

          // save comment
          comment.save();

          // connect new comment to cat
          cat.comments.push(comment);
          cat.save();
          // redirect
          res.redirect('/cats/' + cat._id);
        }
      });
    }
  });
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
