// data/posts.js
let posts = [
    {
        id: 1,
        title: "Мій перший пост",
        description: "Це опис тестового посту, створеного для ініціалізації системи.",
        author: "Адмін"
    }
];

// Функція для генерації унікального ID
const generateId = () => {
    const maxId = posts.length > 0
        ? Math.max(...posts.map(p => p.id))
        : 0;
    return maxId + 1;
};

module.exports = {
    posts,
    generateId
};