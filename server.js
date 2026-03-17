const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const fs = require('fs');

const app = express();
const url = "mongodb://0.0.0.0:27017/";

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Статические файлы (css, js, images, audio, videos)
app.use(express.static(__dirname));

// GET / — главная страница
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET /contact — страница с формой
app.get('/contact', function (req, res) {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// GET /result — страница с результатом, получаем данные из БД
app.get('/result', function (req, res) {
  mongo.connect(url, function (err, db) {
    if (err) return res.status(500).send('<h2>Ошибка подключения к БД</h2>');

    const dbo = db.db("hsedb");

    dbo.collection("contacts").findOne({}, { sort: { _id: -1 } }, function (err, result) {
      db.close();
      if (err) throw err;

      if (!result) {
        return res.send('<h2>Данных пока нет. <a href="/contact">Назад</a></h2>');
      }

      fs.readFile(path.join(__dirname, 'result.html'), 'utf8', function (err, html) {
        if (err) throw err;

        html = html.replace('{{name}}', result.name || '');
        html = html.replace('{{email}}', result.email || '');
        html = html.replace('{{status}}', result.status || '');
        html = html.replace('{{topic}}', result.topic || '');
        html = html.replace('{{message}}', result.message || '');
        html = html.replace('{{rating}}', result.rating || '');

        res.send(html);
      });
    });
  });
});

// POST /submit — обработка формы, сохранение в БД, редирект
app.post('/submit', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);

  console.log(req.body);

  const contact = {
    name:    req.body.name,
    email:   req.body.email,
    status:  req.body.status,
    topic:   req.body.topic,
    message: req.body.message,
    rating:  req.body.result
  };

  mongo.connect(url, function (err, db) {
    if (err) return res.status(500).send('<h2>Ошибка подключения к БД</h2>');

    const dbo = db.db("hsedb");

    dbo.collection("contacts").insertOne(contact, function (err, result) {
      db.close();
      if (err) throw err;

      console.log("Запись добавлена в коллекцию contacts");

      res.redirect('/result');
    });
  });
});

app.listen(3000, function () {
  console.log('Сервер запущен на http://localhost:3000');
});
