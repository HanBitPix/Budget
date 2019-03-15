'use strict';

// Budget Controller
const budgetController = (() => { 
  class Expense {
    constructor(id, description, value){
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    }

    calcPercentage(totalIncome){
      if (totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
        this.percentage = -1;
      }
    }

    getPercentage(){
      return this.percentage;
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

    deleteItem: function(type, id) {
      let ids, index;
      
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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

    calculatePercentages: () => {
      data.allItems.exp.forEach(current => {
        current.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: () => {
      let allPerc = data.allItems.exp.map(cur => cur.getPercentage());
      
      return allPerc;
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
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage'
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

        html = `<div class="item clearfix" id="inc-${obj.id}">
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

        html =  `<div class="item clearfix" id="exp-${obj.id}">
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

    deleteListItem: (selectorID) => {

      let el = document.getElementById(selectorID);

      el.parentNode.removeChild(el);
    },

    clearFields: () => {
      let fields, fieldsArr;

      fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((current) => {
        current.value = '';
      });
    },

    displayBudget: (obj) => {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

      if (obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      }
      else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: (percentages) => {
      let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      let nodeListForEach = (list, callback) => {
        for ( let i = 0;  i < list.length; i++){
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, (current, index) => {
        if (percentages[index] > 0){
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  const updateBudget = () => {

    // Calculate the budget
    budgetCtrl.calculateBudget();
    // return the budget
    const budget = budgetCtrl.getBudget();

    // Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = () => {

    // calculate percentages
    budgetCtrl.calculatePercentages();

    // read percentages from the budget controller
    let percentages = budgetCtrl.getPercentages();

    // update the ui with the new percentages
    UICtrl.displayPercentages(percentages);
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

      // Calculate and update percentages
      updatePercentages();
    }

  
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    
    if (itemID) {
        
      //inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
      
      // 1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);
      
      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      
      // Update and show the new budget
      updateBudget();
      
      // Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: () => {
      console.log('Application has started.');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();