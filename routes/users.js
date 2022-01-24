const router = require('express').Router();

const {
  getUsers, getUser, postUser, patchUser, patchUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', postUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
