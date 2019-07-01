//TODO APP
function Todo(storageName) {
    this.storageName = storageName;
    this.todoBody = document.querySelector('.todo__body');
    this.inputArrow = document.querySelector('.todo__header-arrow');
    this.todoListSettings = this.getFromLocalStorage() || [];

    this.renderFromLocalStorage();

    function generateItemId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    this.todoBody.addEventListener('keydown', (e) => {
        //Add new item with "Enter" key
        if (e.keyCode === 13 && e.target.classList.contains('todo__header-input') && e.target.value.trim() !== '') {
            const footer = document.querySelector('.todo__footer');
            const todoItemSettings = {};

            function updateTodoItemSettings() {
                todoItemSettings.id = generateItemId();
                todoItemSettings.value = e.target.value;
                todoItemSettings.isDone = false;
            }

            if (footer) {
                updateTodoItemSettings();
                this.renderTodoItem(todoItemSettings);
                e.target.value = '';
            } else {
                updateTodoItemSettings();
                this.renderMain(todoItemSettings);
                this.inputArrow.classList.add('todo__header-arrow_active');
                e.target.value = '';
            }

            this.todoListSettings.push(todoItemSettings);
            this.addToLocalStorage(todoItemSettings);
            this.activateSelectAllBtn();
            this.updateAmount();
        }

        //Save editing with "Enter" key
        if (e.keyCode === 13 && e.target.parentNode.classList.contains('todo__item_editing')) {
            completionOfEditing();
        }
    });

    this.inputArrow.addEventListener('click', this.selectAllItems.bind(this));

}

Todo.prototype = Object.create(Storage.prototype);
Todo.prototype.constructor = Todo;

Todo.prototype.renderFromLocalStorage = function () {

    const productsInStorage = this.getFromLocalStorage();
    productsInStorage.forEach((item, index) => {
        if (index === 0) {
            this.renderMain(item);
            if (item.isDone) {
                const currentItem = document.querySelector(`[data-id=${item.id}]`);
                currentItem.classList.add('todo__item_done');
                currentItem.querySelector('.todo__item-check').checked = true;
            }
            this.activateSelectAllBtn();
            this.updateAmount();
            this.inputArrow.classList.add('todo__header-arrow_active');
        } else {
            this.renderTodoItem(item);
            if (item.isDone) {
                const currentItem = document.querySelector(`[data-id=${item.id}]`);
                currentItem.classList.add('todo__item_done');
                currentItem.querySelector('.todo__item-check').checked = true;
            }
            this.activateSelectAllBtn();
            this.updateAmount();
        }
    });

    this.switchClearItemsBtn();
}

Todo.prototype.renderMain = function (settings) {
    const buffer = document.createDocumentFragment();
    const todoMain = document.createElement('section');
    const todoFooter = document.createElement('footer');

    todoMain.classList.add('todo__main');
    todoMain.innerHTML =
        `<ul class="todo__list">
            <li class="todo__item" data-id = "${settings.id}">
                <label class="todo__item-label">
                    <input type="checkbox" class="todo__item-check">
                    <span class="todo__checkbox"></span>
                </label>
                <div class="todo__item-space">
                    <p class="todo__item-text">${settings.value}</p>
                    <button class="todo__item-del"></button>
                </div>
                <input type="text" class="todo__item-edit">
            </li>
        </ul>`
    buffer.appendChild(todoMain);

    todoFooter.classList.add('todo__footer');
    todoFooter.innerHTML =
        `<span class="todo__count">
            <span class="todo__amount">0</span>
            <span class="todo__count-items"></span>
            <span class="todo__count-left">left</span>
        </span>
        <ul class="todo__filters">
            <li class="todo__filter">
                <span class="todo__filter-text todo__filter-text_all todo__filter-text_active">All</span>
            </li>
            <li class="todo__filter">
                <span class="todo__filter-text todo__filter-text_not-done">Active</span>
            </li>
            <li class="todo__filter">
                <span class="todo__filter-text todo__filter-text_done">Completed</span>
            </li>
        </ul>
        <button class="todo__footer-btn">Clear completed</button>`
    buffer.appendChild(todoFooter);

    this.todoBody.appendChild(buffer);
}

Todo.prototype.renderTodoItem = function (settings) {
    const listOfItems = document.querySelector('.todo__list');
    const todoItem = document.createElement('li');

    todoItem.classList.add('todo__item');
    todoItem.setAttribute('data-id', settings.id);
    todoItem.innerHTML =
        `<label class="todo__item-label">
                    <input type="checkbox" class="todo__item-check">
                    <span class="todo__checkbox"></span>
                </label>
                <div class="todo__item-space">
                    <p class="todo__item-text">${settings.value}</p>
                    <button class="todo__item-del"></button>
                </div>
                <input type="text" class="todo__item-edit">`

    listOfItems.appendChild(todoItem);
}

Todo.prototype.updateAmount = function () {
    const todoAmount = document.querySelector('.todo__amount');
    const todoAmountWord = document.querySelector('.todo__count-items');

    const amountArray = this.todoListSettings.filter((item) => {
        return item.isDone === false;
    });

    if (todoAmount && todoAmountWord) {
        todoAmount.textContent = amountArray.length;
        todoAmountWord.textContent = (amountArray.length === 1) ? 'item' : 'items';
    }
}

Todo.prototype.activateSelectAllBtn = function () {
    if (this.todoListSettings.every(item => item.isDone) && this.todoListSettings.length) { //exception vacuously true (empty array)
        this.inputArrow.classList.add('todo__header-arrow_done');
    } else {
        this.inputArrow.classList.remove('todo__header-arrow_done');
    }
}

Todo.prototype.switchClearItemsBtn = function () {
    const clearItemsBtn = document.querySelector('.todo__footer-btn');

    if (this.todoListSettings.some(item => item.isDone === true)) {
        clearItemsBtn.classList.add('todo__footer-btn_active');
    } else {
        clearItemsBtn.classList.remove('todo__footer-btn_active');
    }
}

Todo.prototype.selectAllItems = function () {
    const todoItems = document.querySelectorAll('.todo__item');

    if (this.inputArrow.classList.contains('todo__header-arrow_done')) {
        this.todoListSettings.forEach((item, index) => {
            item.isDone = false;
            todoItems[index].classList.remove('todo__item_done');
            todoItems[index].querySelector('.todo__item-check').checked = false;
        });
    } else {
        this.todoListSettings.forEach((item, index) => {
            if (!item.isDone) {
                item.isDone = true;
                todoItems[index].classList.add('todo__item_done');
                todoItems[index].querySelector('.todo__item-check').checked = true;
            }
        });
    }

    this.activateSelectAllBtn();
    this.switchClearItemsBtn();
    this.updateLocalStorage();
    this.updateAmount();
}

Todo.prototype.clearCompleted = function () {
    const listOfItems = document.querySelector('.todo__list');
    const todoMain = document.querySelector('.todo__main');
    const footer = document.querySelector('.todo__footer');

    for (let i = 0; i < this.todoListSettings.length; i++) {
        if (this.todoListSettings[i].isDone) {
            const element = document.querySelector(`[data-id=${this.todoListSettings[i].id}]`);
            this.todoListSettings.splice(i, 1);
            listOfItems.removeChild(element);
            updateLocalStorage();
            --i;
        }
    }
    this.switchClearItemsBtn();
    this.activateSelectAllBtn();
    if (!this.todoListSettings.length) {
        todoBody.removeChild(todoMain);
        todoBody.removeChild(footer);
        this.inputArrow.classList.remove('todo__header-arrow_active', 'todo__header-arrow_done');
    }
}

const todo = new Todo('todoSettings');

//END TODO APP