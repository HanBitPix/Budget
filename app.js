'use strict';

// Budget Controller
const budgetController = (() => { 
  class Expense {
    constructor(id, description, value){
      this.id = id;
      this.description = description;
      this.value = value;
    }
  }

  class Income {
    constructor(id, description, value){
      this.id = id;
      this.description = description;
      this.value = value;
    }
  }

  let calculateTotal = (type) => {
    let sum = 0;
    data.allItems[type].forEach((cur) => {
      sum += cur.value;
    });

    data.totals[type] = sum;
  };

  const data ={
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: (type, des, val) => {
      let newItem, ID;

      if (data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length -1].id + 1;
      } else {
        ID = 0;
      }

    
      // Create new item based on 'inc' or 'exp type
      if (type === 'exp'){
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc'){
        newItem = new Income(ID, des, val);
      }

      // Push it into our data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },

    calculateBudget: () => {
      
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that we spent
      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

    },

    getBudget: () => {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: () => {
      console.log(data);
    }
  };

})();

// UI Controller
const UIController = (() => {

  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  };

  return {
    getinput: () => {
      return {
        // Will be either income or expense
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: (obj, type) =>{

      let html, element;
      // Create HTML string
      if (type === 'inc'){
        element = DOMstrings.incomeContainer;

        html = `<div class="item clearfix" id="income-${obj.id}">
                  <div class="item__description">${obj.description}</div>
                  <div class="right clearfix">
                    <div class="item__value">${obj.value}</div>
                    <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
                  </div>
                </div>`;
      } else if (type === 'exp'){
        element = DOMstrings.expensesContainer;

        html =  `<div class="item clearfix" id="expense-${obj.id}">
                  <div class="item__description">${obj.description}</div>
                  <div class="right clearfix">
                      <div class="item__value">${obj.value}</div>
                      <div class="item__percentage">21%</div>
                      <div class="item__delete">
                          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                    </div>
                  </div>`;
      }  
      // Insert the HTML to the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', html);
    },

    clearFields: () => {
      let fields, fieldsArr;

      fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((current) => {
        current.value = '';
      });
    },

    getDOMstrings: () => {
      return DOMstrings;
    }
  };
})();


// Global App Controller
const controller = ((budgetCtrl, UICtrl) => {
 
  const setupEventListeners = () => {

    const DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', e => {
      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }

    });
  };

  const updateBudget = () => {

    // Calculate the budget
    budgetCtrl.calculateBudget();
    // return the budget
    const budget = budgetCtrl.getBudget();

    // Display the budget on the UI
    console.log(budget);
  };

  const ctrlAddItem = () => {
    let newItem;

    // Gets the field input data
    const {type, description, value} = UICtrl.getinput();
    
    if(description !== '' && !isNaN(value) && value > 0){
      // Add the item to the budget controller
      newItem = budgetCtrl.addItem(type, description, value);

      // Add the item to the UI
      UICtrl.addListItem(newItem, type);

      // Clear the fields
      UICtrl.clearFields();

      // Calculate and Update Budget
      updateBudget();
    }

  
  };

  return {
    init: () => {
      console.log('Application has started.');
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();