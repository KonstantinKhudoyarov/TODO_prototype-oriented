//TODO APP
function Todo(storageName) {
    this.storageName = storageName;
    this.todoBody = document.querySelector('.todo__body');
    this.inputArrow = document.querySelector('.todo__header-arrow');
    this.todoListSettings = this.getFromLocalStorage() || [];

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
            // activateSelectAllBtn();
            // updateAmount();
        }

        //Save editing with "Enter" key
        if (e.keyCode === 13 && e.target.parentNode.classList.contains('todo__item_editing')) {
            completionOfEditing();
        }
    });

}

Todo.prototype = Object.create(Storage.prototype);
Todo.prototype.constructor = Todo;

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

const todo = new Todo('todoSettings');

//END TODO APP