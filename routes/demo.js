const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../data/database');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('welcome');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/signup', async (req, res) => {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredConfirmEmail = userData['confirm-email'];
  const enteredPassword = userData.password;

  if (
    !enteredEmail
    || !enteredConfirmEmail
    || !enteredPassword
    || enteredPassword.trim() < 6
    || enteredEmail !== enteredConfirmEmail || !enteredEmail.includes('@')
  ) {
    console.log('Incorrect data');
    return res.redirect('/signup');
  }

  const existingUser = await db.getDb().collection('users').findOne({ email: enteredEmail });

  if (existingUser) {
    console.log('User exists already');
    return res.redirect('/signup');
  }

  const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  const user = {
    email: enteredEmail,
    password: hashedPassword,

  };

  await db.getDb().collection('users').insertOne(user);

  res.redirect('/login');
});

router.post('/login', async (req, res) => {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const existingUser = await db.getDb().collection('users').findOne({ email: enteredEmail });

  if (!existingUser) {
    console.log('Could not log in!');
    return res.redirect('/login');
  }
  const passwordsAreEqual = await bcrypt.compare(enteredPassword, existingUser.password);

  if (!passwordsAreEqual) {
    console.log('Could not log in - passwords are not equal!');
    return res.redirect('/login');
  }

  req.session.user = { id: existingUser._id, email: existingUser.email };
  req.session.isAuthenticated = true;
  req.session.save(() => { res.redirect('/admin'); });
});

router.get('/admin', (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).render('401');
  }

  res.render('admin');
});

router.post('/logout', (req, res) => {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect('/');
});

module.exports = router;
