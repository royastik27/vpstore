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
    const DOMsaveMemo = document.getElementById('btn-saveMemo');
    
    // const DOMpaidAmount = document.getElementById('paid-amount');
    const DOMpaidAmount = document.createElement('input');
    DOMpaidAmount.setAttribute('type', 'number');

    return {
        DOMelements: {
            customerName: DOMcustomerName,
            errorEl: DOMerrorEl,
            paidAmount: DOMpaidAmount
        },
        clearInputs: function() {
            DOMproductName.value = DOMcaseAmount.value = DOMquantity.value = DOMerrorEl.textContent = '';
            DOMstationary.checked = true;
        },
        clearTable: function() {
            const sz = DOMtable.rows.length;

            for(let i = 1; i < sz; ++i)
                DOMtable.deleteRow(1);  // always clearing first row
        },
        clearPayment: function() {  // executed when initializing and resetting

            DOMtotalPrice.textContent = 0;
            
            DOMpaidAmount.value = '';
            DOMpayment.firstChild.nextSibling.textContent = 'Paid Amount: '; // label
            DOMpayment.appendChild(DOMpaidAmount);  // input field
            
            DOMpayment.style.display = 'none';
            
            DOMsaveMemo.textContent = 'Save';
            DOMsaveMemo.classList.add('disabled');
        },
        showPayment: function() {
            DOMsaveMemo.textContent = 'Saved';
            DOMsaveMemo.classList.add('disabled');

            const val = DOMpayment.lastChild.value; // coz I used appendChild in clearPayment()

            DOMpayment.removeChild(DOMpayment.lastChild);
            DOMpayment.firstChild.nextSibling.textContent += `  ${val}`;
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

            // MAKING PAYMENT VISIBLE
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

export default DOM;