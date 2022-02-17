const router = require('express').Router();
const {
  getCards, postCard, deleteCard, putCardLike, deleteCardLike,
} = require('../controllers/cards');
const { cardsValididty } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', cardsValididty, postCard);
router.delete('/:id', deleteCard);
router.put('/:id/likes', putCardLike);
router.delete('/:id/likes', deleteCardLike);

module.exports = router;
