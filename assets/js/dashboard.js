const date = new Date();
const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday' ];

document.getElementById('date').textContent = `Date: ${date.toLocaleDateString()} - ${days[date.getDay()]}`;

let itemNumber = 0;

const controller = (function()
{
    let totalPrice = 10;

    const updatePrice = function(newPrice) { totalPrice = newPrice; }

    const clearDOM = function()
    {
        // do something spicy here
    }

    return {
        init: function(){
            updatePrice(0);
            clearDOM();
        }
    }
})();

// TESTING
controller.init();

async function getItem(productName)
{      
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 
                'application/json;charset=utf-8'
        },
        body: JSON.stringify({ productName: productName })
    }

    const res = await(await fetch("/productsapi", options)).json();

    return res;
}

async function addItem()
{
    const productName = document.getElementById('product-name').value;
    let caseamount = parseInt(document.getElementById('caseamount').value);
    let quantity = parseInt(document.getElementById('quantity').value);
    const stationary = document.getElementById('stationary').checked;
    const retail = document.getElementById('retail').checked;

    if(isNaN(caseamount)) caseamount = 0;
    if(isNaN(quantity)) quantity = 0;

    // console.log(typeof productName);
    // console.log(caseamount);
    // console.log(quantity);
    // console.log(typeof stationary);
    // console.log(typeof retail);

    // GETTING DATA
    const res = await getItem(productName);

    // ERROR HANDLING
    const errorEl = document.getElementById('show-error');
    if(!caseamount && !quantity)
    {
        errorEl.textContent = 'Invalid Input!';
        return;
    }
    else if(!res.success)
    {
        errorEl.textContent = res.message;
        return;
    }
    errorEl.textContent = '';

    // SETTING DATA
    const item = res.data;

    // CALCULATING
    let price = 0;

    if(caseamount)  price += item.casePrice * caseamount;

    if(quantity) price += item.price * quantity;

    if(retail) price = item.mrp * quantity;

    // UPDATING DOM
    const el = document.getElementById('product-list');

    var row = el.insertRow(++itemNumber);

    // TABLE CELL SERIAL
    var SLNO = row.insertCell(0);
    var PRODUCTNAME = row.insertCell(1);
    var CASEAMOUNT = row.insertCell(2);
    var QUANTITY = row.insertCell(3);    
    var PRICE = row.insertCell(4);
    var TOTALPRICE = row.insertCell(5);

    // CELL CONTENTS
    SLNO.innerHTML = itemNumber;
    PRODUCTNAME.innerHTML = item.productName;

    if(caseamount)  CASEAMOUNT.innerHTML = caseamount;
    if(quantity)    QUANTITY.innerHTML = quantity;    
    
    if(stationary)  PRICE.innerHTML = item.price;
    else PRICE.innerHTML = item.mrp;
    
    TOTALPRICE.innerHTML = price;
}

document.getElementById('input').addEventListener('keypress', function(event) {

    if (event.key === "Enter") {
        addItem();
    //   event.preventDefault();
    //   document.getElementById("testBtn").click();
    }
});