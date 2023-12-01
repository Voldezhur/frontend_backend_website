// подключение express
const express = require("express");

// создаем объект приложения
const app = express();

// Чтобы подгружались статические файлы
app.use(express.static(__dirname + '/public'))


// Маршруты

app.get("/", function(request, response){
    response.sendFile(__dirname + "/public/home.html");
});

app.get("/games", function(request, response){
    response.sendFile(__dirname + "/public/games.html");
});

app.get("/flappyBird", function(request, response){
    response.sendFile(__dirname + "/public/flappyBird.html");
});

app.get("/snake", function(request, response){
    response.sendFile(__dirname + "/public/snake.html");
});

app.get("/*", function(request, response){
    response.sendFile(__dirname + "/public/404.html", 404);
});


// начинаем прослушивать подключения на 3000 порту
app.listen(3000, '127.0.0.1');