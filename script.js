// Getting elements
const transSelectElement = document.getElementById("transaction-select");
const descriptionElement = document.getElementById("description-input");
const amountElement = document.getElementById("amount-input");
const addBtn = document.getElementById("btn-add");
const tbodyOutput = document.getElementById("transaction-tbody");
const tableElement = document.querySelector("table");
const emptyMsgElement = document.querySelector("#empty");

// Getting balances element
const total_element = document.getElementById("total-ouput");
const income_element = document.getElementById("income-output");
const expense_element = document.getElementById("expense-output");

// Modal
const modal = document.getElementById("modal");
const modalSelect = document.getElementById("edit-select");
const modaldescription = document.getElementById("edit-description");
const modalAmount = document.getElementById("edit-amount");
const modalBtn = document.getElementById("btn-update");
const hiddenInput = document.getElementById("hidden-id");

// Global transaction array
let transactionArray = [];

// Initialize application
function init() {
  const storedTransactions = localStorage.getItem("transactions");
  if (storedTransactions) {
    transactionArray = JSON.parse(storedTransactions);
  }
  loadTransaction();
  checkTransaction();
}

// Check if there are transactions
function checkTransaction() {
  if (transactionArray.length === 0) {
    emptyMsgElement.style.display = "block";
    emptyMsgElement.innerHTML = `<p>No transaction found</p>`;
    tableElement.style.display = "none";
  } else {
    emptyMsgElement.style.display = "none";
    tableElement.style.display = "block";
  }
}

//add btn event listener
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addTransaction();
});

// Clear input values
function clearAll() {
  transSelectElement.value = "";
  descriptionElement.value = "";
  amountElement.value = "";
}

// Add transaction
function addTransaction() {
  if (transSelectElement.value === "" || descriptionElement.value === "" || amountElement.value === "") {
    alert("Please Enter Data");
    return;
  }
  const transObj = {
    id: Date.now(),
    trans_type: transSelectElement.value,
    trans_description: descriptionElement.value,
    trans_amount: amountElement.value,
  };
  transactionArray.push(transObj);
  saveToLocalStorage();
  clearAll();
  loadTransaction();
}

// Load transaction
function loadTransaction() {
  checkTransaction();
  let output = "";
  transactionArray.forEach((item, index) => {
    output += `
      <tr> 
      <td>${index + 1}.</td>
      <td>${item.trans_type}</td>
      <td>${item.trans_description}</td>
      <td>${item.trans_amount}</td>
      <td>
      <button data-id=${item.id} class="edit-btn">Edit</button>
      <button data-id=${item.id} class="delete-btn">Delete</button>
      </td>
      </tr>
      `;
  });

  tbodyOutput.innerHTML = output;

  //getting delete btns
  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let id = Number(e.target.dataset.id);
      deleteTransaction(id);
    });
  });

  //getting edit btns
  const editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let id = Number(e.target.dataset.id);
      openModal(id);
    });
  });

  displayBalance();
}

// Open modal for editing
function openModal(id) {
  let selected_obj = transactionArray.find((item) => item.id === id);
  modalSelect.value = selected_obj.trans_type;
  modaldescription.value = selected_obj.trans_description;
  modalAmount.value = selected_obj.trans_amount;
  hiddenInput.value = id;
  modal.style.display = "block";
  modal.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;`;
}

//closing modal box
function closeModal() {
  modal.style.display = "none";
  modalSelect.value = "";
  modaldescription.value = "";
  modalAmount.value = "";
}

//update button event in modal
modalBtn.addEventListener("click", () => {
  updateTransaction();
});

// Update transaction
function updateTransaction() {
  let new_type = modalSelect.value;
  let new_description = modaldescription.value;
  let new_amount = modalAmount.value;
  let id = Number(hiddenInput.value);
  if (new_type === "" || new_description === "" || new_amount === "") {
    alert("Please Enter Data");
    return;
  }
  transactionArray = transactionArray.map((item) =>
    item.id === id
      ? {
          ...item,
          trans_type: new_type,
          trans_description: new_description,
          trans_amount: new_amount,
        }
      : item
  );
  saveToLocalStorage();
  closeModal();
  loadTransaction();
}

// Display balance
function displayBalance() {
  total_income = 0;
  total_expense = 0;
  transactionArray.forEach((item) => {
    if (item.trans_type === "income") {
      total_income += Number(item.trans_amount);
    } else {
      total_expense += Number(item.trans_amount);
    }
  });
  total_balance = total_income - total_expense;
  income_element.innerHTML = total_income.toFixed(2);
  expense_element.innerHTML = total_expense.toFixed(2);
  total_element.innerHTML = total_balance.toFixed(2);
}

// Delete transaction
function deleteTransaction(id) {
  if (confirm("Are You Sure To Delete?")) {
    transactionArray = transactionArray.filter((item) => item.id !== id);
    saveToLocalStorage();
    loadTransaction();
  }
}

// Save transactions to localStorage
function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactionArray));
}

// Initialize the app
init();
