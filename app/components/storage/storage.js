//Storage
function Storage(name) {
    this.name = name;

    if (!this.getFromLocalStorage()) {
        const storageCell = [];
        localStorage.setItem(this.name, JSON.stringify(storageCell));
    }
}

Storage.prototype.getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(this.name));
}

Storage.prototype.addToLocalStorage = function () {
    const todoSettings = this.getFromLocalStorage();
    todoSettings.push(itemSettings);
    localStorage.setItem(this.name, JSON.stringify(todoSettings));
}

Storage.prototype.updateLocalStorage = function () {
    let todoSettings = this.getFromLocalStorage();
    todoSettings = todoListSettings;//брать массив с настройками с класса TODO
    localStorage.setItem(this.name, JSON.stringify(todoSettings));
}

const storage = new Storage('todoSettings');
//END storage