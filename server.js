const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// База данных пользователей (в памяти сервера)
const users = {
    "admin": "1234",
    "user1": "qwerty",
    "Arzamat": "9876",
    "Medet": "3333"
};

// Главная страница: отправляем index.html при заходе на http://localhost:3000
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('Новое подключение');

    // Логика входа
    socket.on('login', (data) => {
        const { username, password } = data;
        if (users[username] && users[username] === password) {
            socket.emit('login_success', { username });
        } else {
            socket.emit('login_error', 'Ошибка: проверьте логин и пароль');
        }
    });

    // Пересылка сообщений
    socket.on('chat_message', (msg) => {
        // Отправляем сообщение всем, включая отправителя
        io.emit('chat_message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен! Адрес: http://localhost:${PORT}`);
});