const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income');
const expenseDisplay = document.getElementById('expense');
const transactionForm = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionsList = document.getElementById('transactionsList');

// Local Storage'dan tranzaksiyalarni olish yoki bo'sh massiv yaratish
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Barcha tranzaksiyalarni ekranda ko'rsatish
function displayTransactions() {
    transactionsList.innerHTML = ''; // Eski tranzaksiyalarni tozalash
    transactions.forEach(transaction => {
        addTransactionDOM(transaction);
    });
    updateBalance();
}

// Yangi tranzaksiyani DOMga qo'shish
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    // CSS sinfini qo'shish
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.description}
        <span>${sign}${Math.abs(transaction.amount).toLocaleString()} UZS</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    transactionsList.appendChild(item);
}

// Balans, kirim va chiqimni yangilash
function updateBalance() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balanceDisplay.textContent = `${parseFloat(total).toLocaleString()} UZS`;
    incomeDisplay.textContent = `${parseFloat(income).toLocaleString()} UZS`;
    expenseDisplay.textContent = `${parseFloat(expense).toLocaleString()} UZS`;
}

// Tranzaksiyani qo'shish
function addTransaction(e) {
    e.preventDefault();

    if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Iltimos, tavsif va miqdor kiritish maydonlarini to`ldiring.');
        return;
    }

    const transaction = {
        id: generateID(),
        description: descriptionInput.value,
        amount: +amountInput.value // + operatori stringni songa aylantiradi
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateBalance();
    updateLocalStorage();

    descriptionInput.value = '';
    amountInput.value = '';
}

// Tasodifiy ID yaratish
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Tranzaksiyani o'chirish
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    displayTransactions(); // Tranzaksiyalarni qayta yuklash
}

// Local Storage'ni yangilash
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Ilova yuklanganda tranzaksiyalarni ko'rsatish
document.addEventListener('DOMContentLoaded', displayTransactions);
transactionForm.addEventListener('submit', addTransaction);