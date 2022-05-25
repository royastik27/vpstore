const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const productController = require('./controllers/productController.js');
const memoController = require('./controllers/memoController.js');
const userController = require('./controllers/userController.js');

const app = express();

// DATABASE CLIENT
// const db = new MongoClient(process.env.MONGODB_URL);
const db = new MongoClient(process.env.LOCALDB_URL);

// MIDDLEWARES
app.use(express.urlencoded( {extended: true} ));
app.use(express.json());
app.use(session({resave: true, saveUninitialized: true, secret: 'amK2meAsirbaadKaro', cookie: { }}));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.post('/', userController.login);

// AUTHENTICATION
app.use(userController.authenticate);

// APIs
app.post('/productsapi', productController.findProduct);
app.post('/memoapi', memoController.insertMemo);

app.get('/logout', userController.logout);

app.get('/*', (req, res) =>
{
    const templateDashboard = fs.readFileSync(path.join(__dirname, 'templates/dashboard.html'), 'utf-8');

    let output = templateDashboard.replace('{%USER%}', req.session.username);

    res.send(output);
});

app.listen(80, () =>
{
    console.log('Server is listening 😊');
})