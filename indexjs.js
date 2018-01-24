var dataBase = new DataBase('MyKey'); 	// Отримати базу данних по ключу
dataBase.english; 						// Об'єкт бази данних
dataBase.save();
var client;
var newUser;

function authorization(){				// Авторизація
	var newUser = document.getElementById('login').value;
	var newPassword = document.getElementById('password').value;
	if(typeof newUser !== 'number'
		&& newUser !== null
		&& newPassword !== null
		&& typeof newPassword !== 'number'
	  	&& newUser != false
	  	&& newPassword != false){
		client = dataBase.english[newUser]
		if(client && client['password'] == newPassword){
			dataBase.english[newUser] = new User(client.password, client.topResult, client.words);
			displayOffOn();	
			
		}else{
			dataBase.english[newUser] = new User(newPassword);	// Реєстрація в разі невдалої авторизації
			client = dataBase.english[newUser]
			client.addWord(dataBase);
			dataBase.save();
			displayOffOn()
			client.tableWord(dataBase);
		}
		client = dataBase.english[newUser];
		client.setTopResult(0);
	}else{
		alert('Логін і пароль не може починатись з цифри, та бути порожнім');
}
		
	}
document.getElementById('authorization').onclick = function(){		// Авторизація
	authorization();
	client.tableWord(dataBase);
}

document.getElementById('get2').onclick = function(){				// Добавляння слів
	client.addWord(dataBase);
}
document.getElementById("gener").onclick = function(){			    // Гра
	var askEng = document.getElementById("askEng").checked;
	if(client.isGameRun == false){
		client.game(dataBase, askEng);
	
	}
}
function displayOffOn(){											// Зміна фону і інтерфейсу
	document.getElementById('none').style.display = "block"			
	document.getElementById('look').style.display = 'none'
	var block = document.getElementById('image');
	block.style.backgroundImage = "url('bg.jpg')";
}
document.getElementById('Support').onclick = function(){			// Підсказка
	alert('Для видалення слів натисніть на них тричі у \'списку слів\' \n Ви можете переключати стиль гри натиснувши на кнопку "Питати англійські слова" \n Гра триває доки є слова у списку \n Приємної гри!')
}
