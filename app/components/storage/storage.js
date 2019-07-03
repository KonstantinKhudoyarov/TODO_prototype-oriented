//Storage
function Storage(storageName) {
    this.storageName = storageName;

    if (!this.getFromLocalStorage()) {
        const storageCell = [];
        localStorage.setItem(this.storageName, JSON.stringify(storageCell));
    }
}

Storage.prototype.getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(this.storageName));
}

Storage.prototype.addToLocalStorage = function (itemSettings) {
    const settings = this.getFromLocalStorage();
    settings.push(itemSettings);
    localStorage.setItem(this.storageName, JSON.stringify(settings));
}

Storage.prototype.updateLocalStorage = function (settings) {
    let todoSettings = this.getFromLocalStorage();
    todoSettings = settings;
    localStorage.setItem(this.storageName, JSON.stringify(todoSettings));
}

const storage = new Storage('todoSettings');
//END storage