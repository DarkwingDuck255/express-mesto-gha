const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../models/user');
const BadRequest = require('../utils/bad-request');
const NotFound = require('../utils/not-found');
const DefaultError = require('../utils/default-error');
const EmailRegErr = require('../utils/email-reg-err');
const SigninErr = require('../utils/signin-err');

const { NODE_ENV, JWT_SECRET } = process.env;
const getUsers = (req, res, next) => {
  const usersArray = {};

  return users.find(usersArray)
    .then((result) => res.status(200).send(result))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  return users.findById(id)
    .orFail(new NotFound('Пользователь не найден'))
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан невалидный id'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => users.findById(req.user._id)
  .orFail(new NotFound('Пользователь не найден'))
  .then((user) => res.status(200).send({ user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при создании пользователя'));
    } else {
      next(err);
    }
  });

const postUser = (req, res, next) => {
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
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new EmailRegErr('Этот email уже зарегистрирован!'));
      } else {
        next(new DefaultError('На сервере произошла ошибка'));
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

const patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь не найден'))
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при изменении пользователя'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return users.findOneByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // res.cookie('webToken', token, {
      //   httpOnly: true,
      //   maxAge: '7d',
      //   sameSite: true,
      // })
      // .send({ data: user.toJSON });
      res.send({ token });
    })
    .catch(() => {
      next(new SigninErr('Неверный логин или пароль'));
    });
};

module.exports = {
  getUsers, getUser, getCurrentUser, postUser, patchUser, patchUserAvatar, login,
};
