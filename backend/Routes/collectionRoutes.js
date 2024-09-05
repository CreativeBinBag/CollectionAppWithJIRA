const express = require('express');
const { createCollection, getCollections, getCollectionById, viewCollection, updateCollection, getLargestCollection, deleteCollection } = require('../controller/collectionController');
const router = express.Router();

router.post('/create', createCollection);
router.get('/get', getCollections);
router.get('/:id/get', getCollectionById);
router.get('/:id/view', viewCollection);
router.put('/:id/update', updateCollection);
router.get('/top-collections', getLargestCollection);
router.delete('/:id/delete', deleteCollection);

module.exports = router;
