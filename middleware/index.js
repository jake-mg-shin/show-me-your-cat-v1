const Cat = require('../models/cat.js'),
  Comment = require('../models/comment.js');

// all middleware here
let middlewareObj = {};

middlewareObj.checkCatOwnership = function(req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Cat.findById(req.params.id, (err, foundCat) => {
      if (err) {
        req.flash('error', 'not matched');
        res.redirect('back');
      } else {
        // does user upload owned cat?
        // => cat.author.id = mongoose object
        // => req.user._id = string
        if (foundCat.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'you have no permission!');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please, Login!');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        // does user upload owned comment?
        // => comment.author.id = mongoose object
        // => req.user._id = string
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You have no permission');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please, Log In');
    res.redirect('back');
  }
};

// middleware
// logic is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please, Login!');
  res.redirect('/login');
};

module.exports = middlewareObj;
