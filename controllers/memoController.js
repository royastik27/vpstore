const MongoClient = require('mongodb').MongoClient;

const db = new MongoClient(process.env.LOCALDB_URL);

exports.insertMemo = async (req, res) =>
{
    const newMemo = req.body;

    newMemo.userId = req.session.userId;
    newMemo.dateTime = new Date();

    // DATABASE CONNECTION
    await db.connect();

    const result = await db.db('vpstore').collection('memos').insertOne(newMemo);

    // CLOSING DATABASE CONNECTION
    await db.close();

    res.send( {success: true} );
}