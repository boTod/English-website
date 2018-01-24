function DataBase(key){   // Створюється нова база данних по ключу яка витягується з локал стор
	this.localStorageKey = key;  // Ключ 
	var english = localStorage[this.localStorageKey]; // Обєкт за ключом в якому усе зберігається
	this.english = english ? JSON.parse(english) : {}; // Якщо є обєкт тоді витягнути його, якщо на присвоїти порожній
}

DataBase.prototype.save = function(){ // Зберегти данні в локал сторейдж після якихось дій
	localStorage[this.localStorageKey] = JSON.stringify(this.english);
}
