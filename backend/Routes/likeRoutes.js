const express = require('express');
const { addLike, removeLike, checkUserLikes } = require('../controller/likeController');
const router = express.Router();

router.get('/:itemId/checkLikes', checkUserLikes);
router.post('/:itemId/like', addLike);
router.delete('/:itemId/unlike', removeLike);

module.exports = router;
