const express = require('express'),
  router = express.Router({ mergeParams: true }); // make req.params.id to work: mergeParams: true

const Cat = require('../models/cat.js'),
  Comment = require('../models/comment.js');

const middleware = require('../middleware/index.js');

// ===============
// comments routes
// ===============

// new comment
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
router.post('/', middleware.isLoggedIn, (req, res) => {
  // lookup cats by id
  Cat.findById(req.params.id, (err, cat) => {
    if (err) {
      req.flash('error', 'Something Wrong');
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
          req.flash('success', 'Successfully Added');
          res.redirect('/cats/' + cat._id);
        }
      });
    }
  });
});

// edit comment
router.get(
  '/:comment_id/edit',
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.render('comments/edit', {
          cat_id: req.params.id,
          comment: foundComment
        });
      }
    });
  }
);

// update comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.redirect('/cats/' + req.params.id);
      }
    }
  );
});

// destroy comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Deleted');
      res.redirect('/cats/' + req.params.id);
    }
  });
});

module.exports = router;
