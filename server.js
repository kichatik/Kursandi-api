const express = require('express');
const PocketBase = require('pocketbase/cjs');

const app = express();

// Переменные окружения
const PORT = process.env.PORT || 3000;
const PB_URL = process.env.PB_URL || 'http://localhost:8090';

// Клиент PocketBase
const pb = new PocketBase(PB_URL);

app.get('/', async (req, res) => {
  try {
    // Получаем все записи из коллекции "grades"
    const records = await pb.collection('grades').getFullList();

    // Формируем HTML таблицу
    let html = `
      <h1>Таблица оценок студентов</h1>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>Имя студента</th>
          <th>Предмет</th>
          <th>Оценка</th>
          <th>Статус</th>
        </tr>
    `;

    records.forEach(record => {
      html += `
        <tr>
          <td>${record.student_name}</td>
          <td>${record.subject}</td>
          <td>${record.score}</td>
          <td>${record.status}</td>
        </tr>
      `;
    });

    html += '</table>';
    res.send(html);

  } catch (err) {
    // Если база недоступна
    res.status(500).send(`
      <h2>Ошибка подключения к базе данных</h2>
      <p>${err.message}</p>
    `);
  }
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server запущен на http://0.0.0.0:${PORT}`);
});