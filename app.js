const express = require('express'),
  app = express(),
  path = require('path'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  localStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  Cat = require('./models/cat.js'),
  Comment = require('./models/comment.js'),
  User = require('./models/user.js'),
  seedDB = require('./seeds.js');

// requiring routes
const commentRoutes = require('./routes/comments.js'),
  catRoutes = require('./routes/cats.js'),
  indexRoutes = require('./routes/index.js');

mongoose.connect('mongodb://localhost/show_cat_v1');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
// seedDB();

// passport configuration
app.use(
  require('express-session')({
    secret: 'This is the secret!!',
    // have to add the two options below
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// makes currentUser to run at every single route
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRoutes);
app.use('/cats', catRoutes);
app.use('/cats/:id/comments', commentRoutes);

app.listen(3000, () => {
  console.log('The app server has started!!');
});
// app.listen(process.env.PORT, process.env.IP, () => {
//   console.log('The app server has started!!');
// });
