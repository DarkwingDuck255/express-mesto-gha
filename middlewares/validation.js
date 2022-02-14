const { celebrate, Joi } = require('celebrate');

const loginValidity = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const linkAddress = /(http:\/\/|https:\/\/)(www)*[a-z0-9\S]*/;

const signupValidity = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkAddress),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const aboutUserValidity = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const avatarLinkValidity = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(linkAddress),
  }),
});

const cardsValididty = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(linkAddress),
  }),
});

module.exports = {
  loginValidity, signupValidity, aboutUserValidity, avatarLinkValidity, cardsValididty,
};
