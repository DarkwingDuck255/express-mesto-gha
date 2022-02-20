const router = require('express').Router();
const { aboutUserValidity, avatarLinkValidity, idValidity } = require('../middlewares/validation');

const {
  getUsers, getUser, patchUser, patchUserAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', idValidity, getUser);
router.patch('/me', aboutUserValidity, patchUser);
router.patch('/me/avatar', avatarLinkValidity, patchUserAvatar);

module.exports = router;
