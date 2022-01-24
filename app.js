const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const errorHandler = require('./utils/error-handler');
const NotFound = require('./utils/not-found');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '61e9c71394fafa2e0cd68f54',
  };

  next();
});

app.use(routes);

app.use((req, res, next) => {
  next(new NotFound('Не найден маршрут'));
});

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('подключение к базе данных прошло успешно');
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`серв запущен на ${PORT} порту`);
});
