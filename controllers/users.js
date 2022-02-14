const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../models/user');
const BadRequest = require('../utils/bad-request');
const NotFound = require('../utils/not-found');

const getUsers = (req, res) => {
  const usersArray = {};

  return users.find(usersArray)
    .then((result) => res.status(200).send(result))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getUser = (req, res) => {
  const { id } = req.params;
  return users.findById(id)
    .orFail(new NotFound('Пользователь не найден'))
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getCurrentUser = (req, res) => users.findById(req.user._id)
  .orFail(new NotFound('Пользователь не найден'))
  .then((user) => res.status(200).send({ user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  });

const postUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => users.create({
      name, about, avatar, email, password: hash,
    }))
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else if (err.name === 'MongoError' || err.code === 11000) {
        res.status(409).send({ message: 'Этот email уже зарегистрирован!' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;

  return users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при изменении пользователя'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Невалидный id'));
      } else {
        next(err);
      }
    });
};

const patchUserAvatar = (req, res) => {
  const { avatar } = req.body;
  return users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь не найден'))
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при изменении пользователя' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return users.findOneByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'DarkwingDuck255%', { expiresIn: '7d' });
      // res.cookie('webToken', token, {
      //   httpOnly: true,
      //   maxAge: '7d',
      //   sameSite: true,
      // })
      // .send({ data: user.toJSON });
      res.send({ token });
    })
    .catch(() => {
      res.status(401).send({ message: 'Неверный логин или пароль' });
    });
};

module.exports = {
  getUsers, getUser, getCurrentUser, postUser, patchUser, patchUserAvatar, login,
};
