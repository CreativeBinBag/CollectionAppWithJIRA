// routes/itemTagRoutes.js
const express = require('express');
const { getItemsByTag } = require('../controller/itemTagController');
const router = express.Router();

router.get('/:tagId/taggedItems', getItemsByTag);

module.exports = router;
