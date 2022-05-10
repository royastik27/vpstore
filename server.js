const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const templateLogin = fs.readFileSync(path.join(__dirname, 'templates/login.html'), 'utf-8');

const app = express();

require('dotenv').config();

// DATABASE CLIENT
// const db = new MongoClient(process.env.MONGODB_URL);
const db = new MongoClient(process.env.LOCALDB_URL);

app.use(express.urlencoded( {extended: true} ));
app.use(express.json());
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

    // DELETE THIS
        mySession.username = 'royastik27';
        mySession.loggedIn = true;

    if(!mySession.loggedIn) res.end(templateLogin);
    else next();
});

app.post('/productsapi', async (req, res) =>
{
    const productName = req.body.productName;

    //DATABASE CONNECTION
    await db.connect();

    const result = await db.db('vpstore').collection('products').findOne({ productName: new RegExp(productName, 'i') });

    // CLOSING DATABASE CONNECTION
    await db.close();

    if(!result) res.send({ success: false, message: "NOT FOUND!"});
    else
    {
        const productName = result.productName;
        const casePrice = result.casePrice;
        const price = result.price;        
        const mrp = result.mrp;        
    
        res.send( { success: true, data: {
            productName: productName,
            casePrice: casePrice,
            price: price,
            mrp: mrp }
        } );
    }
});

app.get('/logout', (req, res) =>
{
    req.session.destroy();

    res.redirect('/');
});

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