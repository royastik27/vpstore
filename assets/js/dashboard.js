// DATE
const date = new Date();
const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday' ];

document.getElementById('date').textContent = `Date: ${date.toLocaleDateString()} - ${days[date.getDay()]}`;

// IMPORTING CASH MEMO MODULE
import MemoController from './cashmemo/controller.js';

// EVEN LISTENERS
document.getElementById('btn-addItem').onclick = MemoController.addItem;
document.getElementById('btn-saveMemo').onclick = MemoController.saveMemo;
document.getElementById('btn-resetMemo').onclick = MemoController.init;

document.getElementById('input').addEventListener('keypress', function(event) {

    if (event.key === "Enter" && event.target.nodeName !== "BUTTON")
        MemoController.addItem();
});

// USING
MemoController.init();
