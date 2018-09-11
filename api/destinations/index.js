const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { requireAdmin } = require('./../users/util');

router.route('/').get(controller.getDestinations);
router.route('/:id').get(controller.getDestination);
router.route('/').post(requireAdmin, controller.postDestination);
router.route('/:id').delete(requireAdmin, controller.deleteDestination);

module.exports = router;
