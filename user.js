var intervalId;
function User(password, topResult, words){ 	// Створює користувача
	this.password = password;				// Пароль
	this.isGameRun = false;					// Неможна почати гру коли вона триває
	this.currentResult = 0;					// Поточний результат відповідей
	this.topResult = topResult || 0;		// Найкращий результат
	this.words = words || [];				// Слова
	}

User.prototype.tableWord = function(User){  // Таблиця слів
	var onepress = 1;
	var they = this.words;
	function removeChildren(list) {				// Видалення старої таблиці
 		var children = list.childNodes
    	for(var i=children.length; i--; ){
			list.removeChild(children[0]);
    	}
	}	
	removeChildren(list);
	addTable(dataBase);
	function twoClick(){					// При подвійному натисканні на слово видаляє його назавжди
		var inputs = document.getElementsByTagName("li");		// Перевіряє чи натиснуто по слову
		for (var i = 0; i < inputs.length; i++) {
			inputs[i].addEventListener("click", myFunction);
		}
	}

	var myAnchor = document.getElementById("list");				// Заборона виділяти слова
	myAnchor.addEventListener("dblclick", function(event) {
		event.preventDefault();
	}, false);

	
	
	function myFunction(User){  // Бере ідентифікатори тегів li
		var elem = this.id;	
		var elem2;
		for	(var i= 0; i<=they.length -1; i++){
			if(they[i].eng.indexOf(elem) +1 !== 0){		// Видаляє слово з списку	
				they.splice(i,1);
				dataBase.save();
				document.getElementById(elem).parentNode.removeChild(document.getElementById(elem));
				addTable()
			}; 
		}	
	}
	function addTable(){										// Записує в таблицю список слів
		removeChildren(list);
		for(var i = 0; i< they.length; i++){
			var newLi = document.createElement('li');
			newLi.id = they[i].eng;
			newLi.ondblclick = function(){	
			twoClick();
			}
			newLi.innerHTML = they[i].eng + ' - ' + they[i].ukr;
			list.appendChild(newLi);
		}
	}
}


function getRandomInRange(min, max) {																// Функція генератор випадкового числа
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

User.prototype.addWord = function(dataBase){ 														// Функція добавляння слів у профіль
	var positive = 0;
	var newWordEnglish = prompt('Введіть англійське слово');
	var newWordUkraine = prompt('Введіть українське слово');
	if (newWordEnglish == null 
		|| newWordUkraine == null 
		|| newWordEnglish == false 
		|| newWordUkraine == false){
		alert('Введення відмінено')
	}else{
		if(this.words.length !== 0){
		for(var i = 0; i <= this.words.length-1; ++i){
		var newWords = this.words[i];
		if(newWords.eng == newWordEnglish || newWords.ukr == newWordUkraine){		// Перевіряє чи слова не повторюються
			positive = 1
			alert('Це слово вже є в базі')
		}
		};
	
		}
		else{
			positive = 1;
			this.words.push({
				eng: newWordEnglish,
				ukr: newWordUkraine
			})
			dataBase.save();
		}
		if(positive == 0){
			this.words.push({
			eng: newWordEnglish,
			ukr: newWordUkraine
			})
			dataBase.save();	
		}
	}
	client.tableWord()
}
User.prototype.getRandomWord = function(askWords){ 													// Функція отримання слів
	var random = getRandomInRange(0, askWords.length-1);
	return askWords.splice(random, 1)[0];
}

User.prototype.askWord = function(word, askEng){ 													// Перевірка чи відповідь правильна
	if(this.words.length ===0){
		alert('Ви повинні мати хоча б одне слово для гри')
	}else{
		document.getElementById('regen').innerHTML = askEng ? word.ukr : word.eng;
		return new Promise(function(response){										// Проміс що слідкує за правдивим ланцюжком
			var input = document.getElementById("answer");
			var button = document.getElementById('answer1');
			var time = 15;
			document.getElementById('timeout').innerHTML = 'Часу залишилось: ' + time + 'c.';
			intervalId = setInterval(function(){
				--time;
				document.getElementById('timeout').innerHTML = 'Часу залишилось: ' + time + 'c.';
				if (time === 0) {
					response(false)
				}
			}, 1000);

			button.onclick = function(){		// Відповідь користувача
			answers()
			}
			function answers(){				// Порівняння слова і відповіді
				clearInterval(intervalId)
				var answer = input.value;
				if(askEng){
					response(word.eng == answer);
				}else{
					response(word.ukr == answer);
				}
			}
		
			addEventListener("keyup", function(event) {
			if (event.keyCode == 13){
				answers();
			};
			});
		})	

	}
}
	
User.prototype.setTopResult = function(result){ 														// Найкращий результат
	if(this.topResult < result){
		this.topResult = result;
		
	}
	document.getElementById('topresult').innerHTML = 'Найкращий результат: ' + this.topResult;
}

User.prototype.game = function(dataBase, askEng, askWords){ 											// Має новий масив з слів юзера і питає поки не закінчиться слова
	if(this.words.length ===0){
		alert('Для гри потрібна хоча б одна пара слів')
	}else{
		document.getElementById('list').style.display = 'none'	
		this.isGameRun = true;
		var they = this;
		var newResult = document.getElementById('result');
		askWords = askWords || this.words.slice();
		var word = they.getRandomWord(askWords);
		this.askWord(word, askEng).then(function(response){													// Вірна відповідь
			if(response){
				they.currentResult++;

			
			}else{																							// Не правильна відповідь
				alert('Відповідь невірна: ' + word.eng + ' - ' + word.ukr )									
			}
			newResult.innerHTML = 'Кількість правельних відповідей: ' + they.currentResult;
			if(askWords.length > 0){																		// Якщо слова ще є, продовжувати гру
				they.game(dataBase, askEng, askWords)
			}else{																							// Якщо слова закінчились - завершення гри
				they.setTopResult(they.currentResult);
				they.currentResult = 0;
				dataBase.save();
				they.isGameRun = false;
				alert('У вас закінчились слова, почніть гру ще раз, або добавте нові слова')
				clearInterval(intervalId)
				document.getElementById('timeout').innerHTML = 'Часу залишилось:';
				document.getElementById('regen').innerHTML = 'Слово';
				document.getElementById('')
				document.getElementById('list').style.display = 'block';
				they.tableWord(User);
				}
		
		})
	}
}