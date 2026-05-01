const express = require('express');
const { getResources, createResource, updateResource, deleteResource } = require('../controllers/resourceController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getResources).post(protect, admin, createResource);
router.route('/:id').put(protect, admin, updateResource).delete(protect, admin, deleteResource);

module.exports = router;
