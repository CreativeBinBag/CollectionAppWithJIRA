const express = require('express');
const { createTag, getTags, getTagById, updateTag, deleteTag, searchTags} = require('../controller/tagController');
const router = express.Router();

router.post('/create', createTag);
router.get('/get', getTags);
router.get('/:id/get', getTagById);
router.put('/:id/update', updateTag);
router.delete('/:id/delete', deleteTag);
router.get('/search', searchTags);



module.exports = router;
