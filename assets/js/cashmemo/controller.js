import DOM from './dom.js';

const MemoController = (function()
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
            // INITIALIZING VARIABLES
            totalPrice = itemNumber = 0;
            items.length = 0;

            // CLEARING DOM
            DOM.DOMelements.customerName.value = '';
            DOM.clearInputs();
            DOM.clearTable();
            DOM.clearPayment();
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
            totalPrice += newItem.price;

            // UPDATING DOM
            DOM.addItem(newItem, totalPrice);
        },
        saveMemo: async function() {
            // GETTING PAID AMOUNT
            let paidAmount = parseInt(DOM.DOMelements.paidAmount.value);
            if(isNaN(paidAmount)) paidAmount = 0;

            if(!paidAmount) return; // SHOW ERROR HERE

            const customerName = DOM.DOMelements.customerName.value;

            const res = await postMemo(customerName, paidAmount);

            if(res.success)
                DOM.showPayment();
        }
    }
})();

export default MemoController;