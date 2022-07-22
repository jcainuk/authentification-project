const path = require('path');

const express = require('express');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')

const db = require('./data/database');
const demoRoutes = require('./routes/demo');

const MongoDBStore = mongodbStore(session);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false,
  store: 
}));

app.use(demoRoutes);

app.use((error, req, res, next) => {
  res.render('500');
});

db.connectToDatabase().then(() => {
  app.listen(3000);
});
