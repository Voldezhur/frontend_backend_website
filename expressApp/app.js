// подключение express
const express = require("express");

// создаем объект приложения
const app = express();

// Чтобы работал css
app.use(express.static(__dirname + '/public'))

// определяем обработчик для маршрута "/"
app.get("/", function(request, response){
    // отправляем ответ
    response.sendFile(__dirname + "/public/home.html");
});

app.get("/games", function(request, response){
    response.sendFile(__dirname + "/public/games.html");
});

app.get("/flappyBird", function(request, response){
    response.sendFile(__dirname + "/public/flappyBird.html");
});

app.get("/404", function(request, response){
    response.sendFile(__dirname + "/public/404.html");
});


// начинаем прослушивать подключения на 3000 порту
app.listen(3000);