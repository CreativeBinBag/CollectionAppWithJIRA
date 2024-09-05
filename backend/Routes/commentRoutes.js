const express = require('express');
const { createComment, getComments, getCommentById, updateComment, deleteComment } = require('../controller/commentController');
const router = express.Router();

router.post('/', createComment);
router.get('/:itemId/get', getComments);
router.get('/:id/get', getCommentById);
router.put('/:id/update', updateComment);
router.delete('/:id/delete', deleteComment);

module.exports = router;
