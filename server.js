// server.js (фінальна версія для Advanced level)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const postRoutes = require('./routes/postRoutes'); // ІМПОРТ МАРШРУТІВ
const app = express();
const PORT = process.env.PORT || 3000; // Використовуємо змінну оточення або 3000

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Успішне підключення до MongoDB'))
    .catch(err => console.error('❌ Помилка підключення до MongoDB:', err));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Використання маршрутів API
app.use('/api/posts', postRoutes); // Всі запити до /api/posts будуть оброблені postRoutes

// Обробка основного маршруту для index.html (не обов'язково, але корисно)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});