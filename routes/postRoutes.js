// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Всі пости та створення нового
router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);

// Оновлення та видалення конкретного поста
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;