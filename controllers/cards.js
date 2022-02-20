const cards = require('../models/card');
const BadRequest = require('../utils/bad-request');
const NotFound = require('../utils/not-found');
// const DefaultError = require('../utils/default-error');
const AccessDenied = require('../utils/access-denied');

const getCards = (req, res, next) => {
  const cardList = {};
  return cards.find(cardList)
    .then((result) => res.status(200).send(result))
    .catch(next);
};

const postCard = (req, res, next) => {
  const {
    name, link, likes,
  } = req.body;
  const owner = req.user._id;

  return cards.create({
    name, link, likes, owner,
  })
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при добавлении карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;

  return cards.findById(id)
    .orFail(new NotFound('Карточка в базе не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new AccessDenied('не удааляй карточку чужую!'));
      }
      return card.remove()
        .then(() => res.status(200).send({ message: 'Твоя карточка удалена, холоп))' }));
    })
    .catch(next);
};

const putCardLike = (req, res, next) => {
  const { id } = req.params;

  return cards.findOneAndUpdate({ _id: id }, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFound('Передан несуществующий _id карточки.'))
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки/снятиия лайка'));
      } else {
        next(err);
      }
    });
};

const deleteCardLike = (req, res, next) => {
  const { id } = req.params;

  return cards.findOneAndUpdate({ _id: id }, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFound('Передан несуществующий _id карточки.'))
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки/снятиия лайка'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards, postCard, deleteCard, putCardLike, deleteCardLike,
};
