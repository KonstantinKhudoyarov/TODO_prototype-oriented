//TODO APP
function Todo(storageName) {
    this.storageName = storageName;
    this.todoBody = document.querySelector('.todo__body');
    this.inputArrow = document.querySelector('.todo__header-arrow');
    this.todoListSettings = this.getFromLocalStorage() || [];

    if (this.todoListSettings.length) {
        this.renderFromLocalStorage();
    }

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
            this.completionOfEditing();
        }
    });

    this.todoBody.addEventListener('dblclick', this.activateEditingField);

    this.todoBody.addEventListener('click', (e) => {
        //checkbox eventListener
        if (e.target.classList.contains('todo__item-check')) {
            const listItem = e.target.parentNode.parentNode;

            listItem.classList.toggle('todo__item_done');
            this.todoListSettings.forEach((item) => {
                if (listItem.dataset.id === item.id) {
                    item.isDone = !item.isDone;
                    this.updateLocalStorage(this.todoListSettings);
                }
            });
            this.switchClearItemsBtn();
            this.activateSelectAllBtn();
            this.updateAmount();
        }

        //delete item eventListener
        if (e.target.classList.contains('todo__item-del')) {
            const listOfItems = document.querySelector('.todo__list');
            const currentItem = e.target.parentNode.parentNode;
            const todoMain = document.querySelector('.todo__main');
            const footer = document.querySelector('.todo__footer');

            listOfItems.removeChild(currentItem);
            if (this.todoListSettings.length === 1) {//TODO: DRY
                this.todoBody.removeChild(todoMain);
                this.todoBody.removeChild(footer);
                this.inputArrow.classList.remove('todo__header-arrow_active', 'todo__header-arrow_done');
            }

            //update todoListSettings
            this.todoListSettings.forEach((item, index) => {
                if (currentItem.dataset.id === item.id) {
                    this.todoListSettings.splice(index, 1);
                    this.updateLocalStorage(this.todoListSettings);
                }
            });
            this.updateAmount();
        }


        //clear-completed eventListener
        if (e.target.classList.contains('todo__footer-btn')) {
            this.clearCompleted();
        }

        //filter-all eventListener
        if (e.target.classList.contains('todo__filter-text_all')) {
            if (e.target.classList.contains('todo__filter-text_active')) {
                return;
            } else {
                document.querySelector('.todo__filter-text_active').classList.remove('todo__filter-text_active');
                e.target.classList.add('todo__filter-text_active');
                this.todoListSettings.forEach(item => {
                    const currentItem = document.querySelector(`[data-id=${item.id}]`);
                    currentItem.style.display = '';
                });
            }
        }

        //filter-active eventListener
        if (e.target.classList.contains('todo__filter-text_not-done')) {
            this.activeDoneFilters(e.target);
        }

        //filter-done eventListener
        if (e.target.classList.contains('todo__filter-text_done')) {
            this.activeDoneFilters(e.target, false);
        }
    });

    this.inputArrow.addEventListener('click', this.selectAllItems.bind(this));

    document.body.addEventListener('click', (e) => {
        if (!e.target.classList.contains('todo__item-edit')) {
            this.completionOfEditing();
        }
    });

}

Todo.prototype = Object.create(Storage.prototype);
Todo.prototype.constructor = Todo;

Todo.prototype.renderFromLocalStorage = function () {
    const productsInStorage = this.getFromLocalStorage();

    function checkItem(id) {
        const currentItem = document.querySelector(`[data-id=${id}]`);
        currentItem.classList.add('todo__item_done');
        currentItem.querySelector('.todo__item-check').checked = true;
    }

    productsInStorage.forEach((item, index) => {
        if (index === 0) {
            this.renderMain(item);
            if (item.isDone) {
                checkItem(item.id);
            }
            this.activateSelectAllBtn();
            this.updateAmount();
            this.inputArrow.classList.add('todo__header-arrow_active');
        } else {
            this.renderTodoItem(item);
            if (item.isDone) {
                checkItem(item.id);
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
    this.updateLocalStorage(this.todoListSettings);
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
            this.updateLocalStorage(this.todoListSettings);
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

Todo.prototype.activeDoneFilters = function (target, boolean = true) {
    document.querySelector('.todo__filter-text_active').classList.remove('todo__filter-text_active');
    target.classList.add('todo__filter-text_active');
    this.todoListSettings.forEach(item => {
        const currentItem = document.querySelector(`[data-id=${item.id}]`);
        currentItem.style.display = '';
    });
    const items = this.todoListSettings.filter((item) => {
        return item.isDone === boolean;
    });
    items.forEach(item => {
        const doneItem = document.querySelector(`[data-id=${item.id}]`);
        doneItem.style.display = 'none';
    });
}

Todo.prototype.activateEditingField = function (e) {
    if (e.target.classList.contains('todo__item-text')) {
        const currentItem = e.target.parentNode.parentNode;
        const editInput = e.target.parentNode.nextElementSibling;
        currentItem.classList.add('todo__item_editing');
        editInput.value = e.target.textContent;
        editInput.focus();
    }
}

Todo.prototype.completionOfEditing = function () {
    const editingItem = document.querySelector('.todo__item_editing');
    const editedItem = document.querySelector('.todo__item_editing .todo__item-text');
    const editedInput = document.querySelector('.todo__item_editing .todo__item-edit');
    if (editingItem) {
        editingItem.classList.remove('todo__item_editing');
        editedItem.textContent = editedInput.value;
        this.todoListSettings.forEach(item => {
            if (editingItem.dataset.id === item.id) {
                item.value = editedInput.value;
                this.updateLocalStorage(this.todoListSettings);
            }
        });
    }
}

const todo = new Todo('todoSettings');

//END TODO APP