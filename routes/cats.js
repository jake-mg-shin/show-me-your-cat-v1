const express = require('express'),
  router = express.Router();

const Cat = require('../models/cat.js');

const middleware = require('../middleware/index.js');

// index route: show all of cats
router.get('/', (req, res) => {
  // get dbs of added cats
  Cat.find({}, (err, catsDbs) => {
    if (err) {
      console.log(err);
    } else {
      res.render('cats/index', { cats: catsDbs, currentUser: req.user });
    }
  });
});

// create route: add new add cat to dbs
router.post('/', middleware.isLoggedIn, (req, res) => {
  // get data from form and cats arr
  const name = req.body.name,
    image = req.body.image,
    desc = req.body.desc,
    author = {
      id: req.user._id,
      username: req.user.username
    },
    newCat = { name: name, image: image, desc: desc, author: author };
  // add a new cat and save to dbs
  Cat.create(newCat, (err, addedCat) => {
    if (err) {
      console.log(err);
    } else {
      // then, redirect cats page
      res.redirect('/cats');
      // console.log(newCat);
    }
  });
});

// new route: show create form
// should be first before show route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('cats/new');
});

// show route: show more info of db of cats by id
router.get('/:id', (req, res) => {
  // find a cat by id
  Cat.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCatId) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(foundCatId);
        // render the cat the same as the id
        res.render('cats/show', { cats: foundCatId });
      }
    });
});

// edit route
router.get('/:id/edit', middleware.checkCatOwnership, (req, res) => {
  Cat.findById(req.params.id, (err, foundCat) => {
    res.render('cats/edit', { cat: foundCat });
  });
});

// update route
router.put('/:id', middleware.checkCatOwnership, (req, res) => {
  // find and update correct cat
  Cat.findByIdAndUpdate(req.params.id, req.body.cat, (err, updatedCat) => {
    if (err) {
      res.redirect('/cats');
    } else {
      // redirect to show page
      res.redirect('/cats/' + req.params.id);
    }
  });
});

// destroy route
router.delete('/:id', middleware.checkCatOwnership, (req, res) => {
  Cat.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/cats');
    } else {
      res.redirect('/cats');
    }
  });
});

module.exports = router;
