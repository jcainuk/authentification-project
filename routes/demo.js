const express = require('express');

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

router.post('/signup', async (req, res) => {});

router.post('/login', async (req, res) => {});

router.get('/admin', (req, res) => {
  res.render('admin');
});

router.post('/logout', (req, res) => {});

module.exports = router;
