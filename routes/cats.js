const express = require('express'),
  router = express.Router();

const Cat = require('../models/cat.js');

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
router.post('/', isLoggedIn, (req, res) => {
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
router.get('/new', isLoggedIn, (req, res) => {
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
router.get('/:id/edit', checkCatOwnership, (req, res) => {
  Cat.findById(req.params.id, (err, foundCat) => {
    res.render('cats/edit', { cat: foundCat });
  });
});
// update route
router.put('/:id', checkCatOwnership, (req, res) => {
  // find and update correct cat
  Cat.findByIdAndUpdate(req.params.id, req.body.cat, (err, updatedCat) => {
    if (err) {
      res.redirect('/cats');
    } else {
      res.redirect('/cats/' + req.params.id);
    }
  });
  // redirect to show page
});

// destroy route
router.delete('/:id', checkCatOwnership, (req, res) => {
  Cat.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/cats');
    } else {
      res.redirect('/cats');
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

function checkCatOwnership(req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Cat.findById(req.params.id, (err, foundCat) => {
      if (err) {
        res.redirect('back');
      } else {
        // does user upload owned cat?
        // => cat.author.id = mongoose object
        // => req.user._id = string
        if (foundCat.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

module.exports = router;
