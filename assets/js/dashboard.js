const date = new Date();
const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday' ];

document.getElementById('date').textContent = `Date: ${date.toLocaleDateString()} - ${days[date.getDay()]}`;

let itemNumber = 0;

const controller = (function()
{
    let totalPrice, itemNumber;
    const items = [];
    /**
     * itemNumber:  1 based [ table row: 0 based - 1st one is thead ]
    **/

    const addTotalPrice = function(newPrice) { totalPrice += newPrice; }

    const validateItem = function(item)
    {
        if(!item.caseAmount && !item.quantity)
        {
            DOM.DOMelements.errorEl.textContent = 'Invalid Input!';
            return false;
        }

        return true;
    }

    const findItem = async function(productName)
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

    const createItem = function(DOMitem, item)
    {
        // CALCULATING
        let price = 0;

        if(DOMitem.caseAmount)  price += item.casePrice * DOMitem.caseAmount;

        if(DOMitem.quantity) price += item.price * DOMitem.quantity;

        if(DOMitem.retail) price = item.mrp * DOMitem.quantity;

        // console.log(price);

        return {
            serialNo: ++itemNumber,
            productName: item.productName,
            caseAmount: DOMitem.caseAmount,
            quantity: DOMitem.quantity,
            price: (DOMitem.stationary) ? item.price : item.mrp,
            totalPrice: price
        }
    }

    return {
        getItemNumber: () => itemNumber,
        init: function(){
            totalPrice = itemNumber = 0;            
            DOM.clearTable();
            DOM.DOMelements.totalPrice.textContent = totalPrice;
            DOM.DOMelements.saveMemo.classList.add('disabled');
        },
        addItem: async function() {
            const DOMitem = DOM.getItem();

            // FILTERING
            if(isNaN(DOMitem.caseAmount)) DOMitem.caseAmount = 0;
            if(isNaN(DOMitem.quantity)) DOMitem.quantity = 0;

            // VALIDATING
            if(!validateItem(DOMitem)) return;

            // GETTING DATA FROM API
            const res = await findItem(DOMitem.productName);

            if(!res.success)
            {
                DOM.DOMelements.errorEl.textContent = 'NOT FOUND!';
                return;
            }

            const item = res.data;  // got data

            const newItem = createItem(DOMitem, item);

            // UPDATING CONTROLLER
            items.push(newItem);
            totalPrice += newItem.totalPrice;

            // UPDATING DOM
            DOM.addItem(newItem, totalPrice);
        }
    }
})();

const DOM = (function()
{
    const DOMtable = document.getElementById('product-list');
    const DOMerrorEl = document.getElementById('show-error');

    // INPUT DOMs
    const DOMproductName = document.getElementById('product-name');
    const DOMcaseAmount = document.getElementById('caseamount');
    const DOMquantity = document.getElementById('quantity');
    const DOMstationary = document.getElementById('stationary');
    const DOMretail = document.getElementById('retail');

    const DOMcustomerName = document.getElementById('customer-name');
    const DOMtotalPrice = document.getElementById('total-price');
    const DOMsaveMemo = document.getElementById('save-memo');

    return {
        DOMelements: {
            table: DOMtable,
            errorEl: DOMerrorEl,
            totalPrice: DOMtotalPrice,
            saveMemo: DOMsaveMemo
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
        },
        addItem: function(item, totalPrice) {

            // CLEARING ERROR FIELD
            DOMerrorEl.textContent = '';
            DOMsaveMemo.classList.remove('disabled');

            const row = DOMtable.insertRow(item.serialNo); // same as controller.getItemNumber()

            // TABLE CELL SERIAL
            const SLNO = row.insertCell(0);
            const PRODUCTNAME = row.insertCell(1);
            const CASEAMOUNT = row.insertCell(2);
            const QUANTITY = row.insertCell(3);    
            const PRICE = row.insertCell(4);
            const TOTALPRICE = row.insertCell(5);

            // CELL CONTENTS
            SLNO.innerHTML = item.serialNo;
            PRODUCTNAME.innerHTML = item.productName;

            if(item.caseAmount)  CASEAMOUNT.innerHTML = item.caseAmount;
            if(item.quantity)    QUANTITY.innerHTML = item.quantity;    
            
            PRICE.innerHTML = item.price;
            
            TOTALPRICE.innerHTML = item.totalPrice;

            DOMtotalPrice.textContent = totalPrice;
        }
    }
})();

document.getElementById('input').addEventListener('keypress', function(event) {

    if (event.key === "Enter" && event.target.nodeName !== "BUTTON")
        controller.addItem();
});

// USING
controller.init();
