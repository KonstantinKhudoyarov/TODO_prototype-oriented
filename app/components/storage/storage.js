//Storage
function Storage() {

    if (!this.getFromLocalStorage()) {
        const storageCell = [];
        localStorage.setItem(this.storageName, JSON.stringify(storageCell));
    }
}

Storage.prototype.getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(this.storageName));
}

Storage.prototype.addToLocalStorage = function (itemSettings) {
    const todoSettings = this.getFromLocalStorage();
    todoSettings.push(itemSettings);
    localStorage.setItem(this.storageName, JSON.stringify(todoSettings));
}

Storage.prototype.updateLocalStorage = function () {
    let todoSettings = this.getFromLocalStorage();
    todoSettings = todoListSettings;//брать массив с настройками с класса TODO
    localStorage.setItem(this.storageName, JSON.stringify(todoSettings));
}

const storage = new Storage();
//END storage