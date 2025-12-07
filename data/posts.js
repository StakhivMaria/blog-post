// data/posts.js

// Масив 'posts' використовується для тимчасового зберігання даних (режим "in-memory").
let posts = [
    {
        id: 1,
        title: "Мій перший пост",
        description: "Це опис тестового посту, створеного для ініціалізації системи.",
        author: "Адмін"
    }
];

// Функція для генерації унікального числового ID для нових постів.
const generateId = () => {
    // Знаходимо максимальний поточний ID
    const maxId = posts.length > 0
        ? Math.max(...posts.map(p => p.id))
        : 0;
    // Повертаємо наступний ID
    return maxId + 1;
};

// Експорт функцій та даних для використання в інших модулях (наприклад, у server.js).
module.exports = {
    posts,
    generateId
};