// server.js (фінальна версія для Advanced level)
require('dotenv').config(); // Завантаження змінних оточення (наприклад, MONGO_URI) з файлу .env
const express = require('express'); // Підключення фреймворку Express
const mongoose = require('mongoose'); // Підключення Mongoose для роботи з MongoDB
const path = require('path'); // Підключення модуля для роботи зі шляхами
const postRoutes = require('./routes/postRoutes'); // ІМПОРТ МАРШРУТІВ
const app = express(); // Створення екземпляра застосунку Express
const PORT = process.env.PORT || 3000; // Визначення порту (з .env або за замовчуванням 3000)

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Успішне підключення до MongoDB')) // У разі успіху
    .catch(err => console.error('❌ Помилка підключення до MongoDB:', err)); // У разі помилки

// Middleware
app.use(express.json()); // Дозволяє Express обробляти JSON-дані у тілі запиту (req.body)
app.use(express.static(path.join(__dirname, 'public'))); // Обслуговування статичних файлів (HTML, CSS, JS) з папки 'public'

// Використання маршрутів API
// Направляє всі запити, що починаються з /api/posts, до postRoutes
app.use('/api/posts', postRoutes); 

// Обробка основного маршруту
// Надсилає клієнту файл index.html при доступі до кореневого шляху (/)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});