const mongoose = require('mongoose'),
  Cat = require('./models/cat.js'),
  Comment = require('./models/comment.js');

const basicDB = [
  {
    name: 'Pancake',
    image:
      'https://images.unsplash.com/photo-1501820488136-72669149e0d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    desc:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    name: 'Dodo',
    image:
      'https://images.unsplash.com/photo-1491485880348-85d48a9e5312?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    desc:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    name: 'Nomi',
    image:
      'https://images.unsplash.com/photo-1488740304459-45c4277e7daf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    desc:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }
];

function seedDB() {
  // remove previous DB of cats
  Cat.remove({}, err => {
    // if (err) {
    //   console.log(err);
    // }
    // console.log('removed cat!');
    // // add basic DB of cats
    // basicDB.forEach(seed => {
    //   Cat.create(seed, (err, db) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log('added a basic cat');
    //       // add a comment
    //       Comment.create(
    //         {
    //           text: 'This cat is so cute!',
    //           author: 'abc@qmail.com'
    //         },
    //         (err, comment) => {
    //           if (err) {
    //             console.log(err);
    //           } else {
    //             db.comments.push(comment);
    //             db.save();
    //             console.log('added a comment');
    //           }
    //         }
    //       );
    //     }
    //   });
    // });
  });
}

module.exports = seedDB;
