// TAKE CARE ABOUT templateLogin
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const db = new MongoClient(process.env.LOCALDB_URL);

const templateLogin = fs.readFileSync(path.join(__dirname, '../templates/login.html'), 'utf-8');

exports.authenticate = (req, res, next) =>
{
    const mySession = req.session;

    // DELETE THIS
        mySession.userId = new ObjectId("627a30eeeb205fe35623a532");
        mySession.username = 'royastik27';
        mySession.loggedIn = true;

    if(!mySession.loggedIn) res.end(templateLogin);
    else next();
}

exports.login = async (req, res) =>
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
        mySession.userId = result._id;
        mySession.username = username;
        mySession.loggedIn = true;

        res.redirect('/');
    }
    else res.send(templateLogin);
}

exports.logout = (req, res) =>
{
    req.session.destroy();
    res.redirect('/');
}