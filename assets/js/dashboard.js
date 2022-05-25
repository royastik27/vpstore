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

    const validateItem = function(item)
    {
        if((!item.caseAmount && !item.quantity) || !(item.stationary ^ item.retail))
        {
            DOM.DOMelements.errorEl.textContent = 'Invalid Input!';
            return false;
        }

        return true;
    }

    const postMemo = async function(customerName, paidAmount)
    {
        // TAKING CEIL VALUE OF TOTALPRICE
        totalPrice = Math.ceil(totalPrice);

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 
                    'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                customerName: customerName,
                items: items,
                totalPrice: totalPrice,
                paidAmount: paidAmount,
                paid: (totalPrice === paidAmount) ? true : false
            })
        }

        const res = await(await fetch("/memoapi", options)).json();
    
        return res;
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
        let price;

        if(DOMitem.stationary)  price = (DOMitem.caseAmount * item.casePrice) + (DOMitem.quantity * item.price);
        else    // for retail
            price = (DOMitem.caseAmount * item.caseQuantity + DOMitem.quantity) * item.mrp;

        return {
            serialNo: ++itemNumber,
            productName: item.productName,
            caseAmount: DOMitem.caseAmount,
            quantity: DOMitem.quantity,
            pricePerPiece: price / (DOMitem.caseAmount * item.caseQuantity + DOMitem.quantity),
            price: price
        }
    }

    return {
        getItemNumber: () => itemNumber,
        init: function(){
            totalPrice = itemNumber = 0;            
            DOM.clearTable();
            DOM.DOMelements.totalPrice.textContent = totalPrice;
            DOM.DOMelements.saveMemo.classList.add('disabled');
            DOM.DOMelements.payment.style.display = 'none';
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
            items.push(newItem);items
            totalPrice += newItem.price;

            // UPDATING DOM
            DOM.addItem(newItem, totalPrice);
        },
        saveMemo: async function() {
            // GETTING PAID AMOUNT
            let paidAmount = parseInt(DOM.DOMelements.paidAmount.value);
            if(isNaN(paidAmount)) paidAmount = 0;

            const customerName = DOM.DOMelements.customerName.value;

            // CODE HERE
            const res = await postMemo(customerName, paidAmount);

            if(res.success) console.log('Item Added');
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

    const DOMpayment = document.getElementById('payment');
    const DOMpaidAmount = document.getElementById('paid-amount');
    const DOMsaveMemo = document.getElementById('save-memo');

    return {
        DOMelements: {
            customerName: DOMcustomerName,
            table: DOMtable,
            errorEl: DOMerrorEl,
            totalPrice: DOMtotalPrice,
            payment: DOMpayment,
            paidAmount: DOMpaidAmount,
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
            DOMpayment.style.display = 'block';

            const row = DOMtable.insertRow(item.serialNo); // same as controller.getItemNumber()

            // TABLE CELL SERIAL
            const SLNO = row.insertCell(0);
            const PRODUCTNAME = row.insertCell(1);
            const CASEAMOUNT = row.insertCell(2);
            const QUANTITY = row.insertCell(3);    
            const PRICEPERPIECE = row.insertCell(4);
            const PRICE = row.insertCell(5);

            // CELL CONTENTS
            SLNO.innerHTML = item.serialNo;
            PRODUCTNAME.innerHTML = item.productName;

            if(item.caseAmount)  CASEAMOUNT.innerHTML = item.caseAmount;
            if(item.quantity)    QUANTITY.innerHTML = item.quantity;    
            
            PRICEPERPIECE.innerHTML = item.pricePerPiece.toFixed(2);            
            PRICE.innerHTML = item.price.toFixed(2);

            // Main Total Price
            DOMtotalPrice.textContent = Math.ceil(totalPrice);
        }
    }
})();

document.getElementById('input').addEventListener('keypress', function(event) {

    if (event.key === "Enter" && event.target.nodeName !== "BUTTON")
        controller.addItem();
});

// USING
controller.init();
