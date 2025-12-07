// routes/postRoutes.js
const express = require('express'); // Підключення фреймворку Express
const router = express.Router(); // Створення об'єкта Router для визначення маршрутів
const postController = require('../controllers/postController'); // Підключення контролерів для обробки логіки

// --- Маршрути для колекції постів (/api/posts) ---

// GET /api/posts: Отримати список усіх постів
router.get('/', postController.getPosts);
// GET /api/posts/:id: Отримати один пост за ID
router.get('/:id', postController.getPostById);
// POST /api/posts: Створити новий пост
router.post('/', postController.createPost);

// --- Маршрути для конкретного поста (/api/posts/:id) ---

// PUT /api/posts/:id: Оновити існуючий пост
router.put('/:id', postController.updatePost);
// DELETE /api/posts/:id: Видалити пост
router.delete('/:id', postController.deletePost);

module.exports = router; // Експорт маршрутизатора