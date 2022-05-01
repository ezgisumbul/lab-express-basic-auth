const express = require('express');
const User = require('../models/user');
const baseRouter = new express.Router();
const bcryptjs = require('bcryptjs');
const routeGuard = require('./../middleware/route-guard');

baseRouter.get('/', (req, res, next) => {
  res.render('index');
});

baseRouter.get('/signup', (req, res, next) => {
  res.render('signup');
});

baseRouter.get('/login', (req, res, next) => {
  res.render('login');
});

baseRouter.post('/signup', (req, res, next) => {
  const { name, username, password } = req.body;

  bcryptjs.hash(password, 10).then((passwordHashandSalt) => {
    return User.create({ name, username, passwordHashandSalt })
      .then((user) => {
        req.session.userId = user._id;

        res.redirect('/');
      })
      .catch((err) => next(err));
  });
});

baseRouter.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  console.log({ username, password });

  let user;

  User.findOne({ username })
    .then((userDoc) => {
      console.log(userDoc);

      user = userDoc;

      if (user === null) {
        throw new Error('No such user');
      } else {
        //throw new Error('What is happening?');

        return bcryptjs.compare(password, user.passwordHashandSalt);
      }
    })
    .then((comparisonResult) => {
      if (comparisonResult === true) {
        req.session.userId = user._id;

        res.redirect('/main');
      } else {
        throw new Error('Wrong password');
      }
    })
    .catch((err) => {
      next(err);
    });
});

baseRouter.get('/main', routeGuard, (req, res, next) => {});

baseRouter.get('/private', routeGuard, (req, res, next) => {
  // res.render('private', { user: req.user });
  res.render('private');
});

baseRouter.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = baseRouter;
