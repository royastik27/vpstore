const date = new Date();
const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday' ];

document.getElementById('date').textContent = `Date: ${date.toLocaleDateString()} - ${days[date.getDay()]}`;

let itemNumber = 0;

async function getItem(productName, casemount, quantity)
{

    const user = { 
        productName: productName, 
        caseamount: caseamount,
        quantity: quantity 
    }
      
    // Options to be given as parameter 
    // in fetch for making requests
    // other then GET
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 
                'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    }

    const res = await fetch("/productsapi", options);

    console.log(res);
}


function addItem()
{
    console.log('Adding item...');

    const productName = document.getElementById('product-name').value;
    const caseamount = document.getElementById('caseamount').value;
    const quantity = document.getElementById('quantity').value;
    const stationary = document.getElementById('stationary').checked;
    const retail = document.getElementById('retail').checked;

    console.log(productName);
    console.log(caseamount);
    console.log(quantity);
    console.log(stationary);
    console.log(retail);

    const el = document.getElementById('product-list');

    var row = el.insertRow(++itemNumber);

    // TABLE CELL SERIAL
    var SLNO = row.insertCell(0);
    var PRODUCTNAME = row.insertCell(1);
    var CASEAMOUNT = row.insertCell(2);
    var QUANTITY = row.insertCell(3);

    getItem(productName, caseamount, quantity);

    // CELL CONTENTS
    SLNO.innerHTML = itemNumber;
    PRODUCTNAME.innerHTML = productName;
    CASEAMOUNT.innerHTML = caseamount;
    QUANTITY.innerHTML = quantity;
}