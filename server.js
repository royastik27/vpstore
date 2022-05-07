const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const templateLogin = fs.readFileSync(path.join(__dirname, 'templates/login.html'), 'utf-8');

const app = express();

require('dotenv').config();

// DATABASE CLIENT
const db = new MongoClient(process.env.MONGODB_URL);

app.use(express.urlencoded( {extended: true} ));
app.use(session({resave: true, saveUninitialized: true, secret: 'amK2meAsirbaadKaro', cookie: { }}));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.post('/', async (req, res) =>
{
    const username = req.body.username;
    const password = req.body.password;

    //DATABASE CONNECTION
    await db.connect();

    const result = await db.db('vpstore').collection('users').findOne( { username: username, password: password });

    // CLOSING DATABASE CONNECTION
    await db.close();

    if(result)
    {
        const mySession = req.session;
        mySession.username = username;
        mySession.loggedIn = true;

        res.redirect('/');
    }
    else res.send(templateLogin);
});

// AUTHENTICATION
app.use((req, res, next) =>
{
    const mySession = req.session;

    if(!mySession.loggedIn) res.end(templateLogin);
    else next();
});

app.get('/', (req, res) =>
{
    const templateDashboard = fs.readFileSync(path.join(__dirname, 'templates/dashboard.html'), 'utf-8');

    res.send(templateDashboard);
});

app.listen(80, () =>
{
    console.log('Server is listening 😊');
})