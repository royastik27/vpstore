const MongoClient = require('mongodb').MongoClient;

const db = new MongoClient(process.env.LOCALDB_URL);

exports.findProduct = async (req, res) => {
    const productName = req.body.productName;

    //DATABASE CONNECTION
    await db.connect();

    const result = await db.db('vpstore').collection('products').findOne({ productName: new RegExp(productName, 'i') });

    // CLOSING DATABASE CONNECTION
    await db.close();

    if (!result)
        res.send({ success: false, message: "NOT FOUND!" });

    else {
        const productName = result.productName;
        const casePrice = result.casePrice;
        const caseQuantity = result.caseQuantity;
        const price = result.price;
        const mrp = result.mrp;

        res.send({
            success: true, data: {
                productName: productName,
                casePrice: casePrice,
                caseQuantity: caseQuantity,
                price: price,
                mrp: mrp
            }
        });
    }
}