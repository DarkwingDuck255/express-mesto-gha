const router = require('express').Router();
const {
  getCards, postCard, deleteCard, putCardLike, deleteCardLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', postCard);
router.delete('/:cardId', deleteCard);
router.put('/:id/likes', putCardLike);
router.delete('/:id/likes', deleteCardLike);

module.exports = router;