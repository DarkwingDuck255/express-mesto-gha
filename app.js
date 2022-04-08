require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const errorHandler = require('./utils/error-handler');
const NotFound = require('./utils/not-found');
const { login, postUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { signupValidity, loginValidity } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('подключение к базе данных прошло успешно');
});

app.use(bodyParser.json());
app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.post('/signin', loginValidity, login);
app.post('/signup', signupValidity, postUser);

app.use(auth);

app.use(routes);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFound('Не найден маршрут'));
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`серв запущен на ${PORT} порту`);
});
