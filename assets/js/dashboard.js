const date = new Date();
const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday' ];

document.getElementById('date').textContent = `Date: ${date.toLocaleDateString()} - ${days[date.getDay()]}`;

let itemNumber = 0;

const controller = (function()
{
    let totalPrice, itemNumber;
    /**
     * itemNumber:  1 based [ table row: 0 based - 1st one is thead ]
    **/

    const addTotalPrice = function(newPrice) { totalPrice += newPrice; }

    const validateItem = function(item)
    {
        if(!caseamount && !quantity)
        {
            DOM.DOMelements.errorEl.textContent = 'Invalid Input!';
            return false;
        }

        return true;
    }

    return {
        getItemNumber: () => itemNumber,
        init: function(){
            totalPrice = itemNumber = 0;            
            // DOM.clearTable();            
        },
        addItem: function() {
            const item = DOM.getItem();

            // FILTERING
            if(isNaN(item.caseamount)) item.caseamount = 0;
            if(isNaN(item.quantity)) item.quantity = 0;

            if(validateItem(item))
            {
                // do something
            }
        }
    }
})();

const DOM = (function()
{
    const DOMtable = document.getElementById('product-list');
    const DOMerrorEl = document.getElementById('show-error');

    // GET ITEM VALUES FROM DOM
    const DOMproductName = document.getElementById('product-name');
    const DOMcaseAmount = document.getElementById('caseamount');
    const DOMquantity = document.getElementById('quantity');
    const DOMstationary = document.getElementById('stationary');
    const DOMretail = document.getElementById('retail');

    return {
        DOMelements: {
            table: DOMtable,
            errorEl: DOMerrorEl
        },
        clearTable: function() {
            const itemNumber = controller.getItemNumber();

            for(let i = 0; i < itemNumber; ++i)
                DOMtable.deleteRow(1);  // always clearing first row
        },
        getItem: function() {
            return {
                productName: DOMproductName.value,
                caseAmount: parseInt(DOMcaseAmount.value),
                quantity: parseInt(DOMquantity.value),
                stationary: DOMstationary.checked,
                retail: DOMretail.checked
            }
        }
    }
})();

// TESTING
// controller.init();

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
    // GET ITEM VALUES FROM DOM
    const productName = document.getElementById('product-name').value;
    let caseamount = parseInt(document.getElementById('caseamount').value);
    let quantity = parseInt(document.getElementById('quantity').value);
    const stationary = document.getElementById('stationary').checked;
    const retail = document.getElementById('retail').checked;

    if(isNaN(caseamount)) caseamount = 0;
    if(isNaN(quantity)) quantity = 0;

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

    if (event.key === "Enter")
        addItem();  // CHANGE to controllr.addItem()
});