const express = require('express');
const { createItem, getItems, getItemById, updateItem, deleteItem, getRecentItems, itemsForFeed } = require('../controller/itemController');
const router = express.Router();

router.post('/:id/create', createItem);
router.get('/get', getItems);
router.get('/:id/get', getItemById);
router.put('/:id/update', updateItem);
router.delete('/:id/delete', deleteItem);
router.get('/getRecent', getRecentItems)
router.get('/itemsForFeed', itemsForFeed)


module.exports = router;
