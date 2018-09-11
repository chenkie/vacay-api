const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.route('/').post(controller.postUser);
router.route('/check-email').get(controller.getUserByEmail);
router.route('/check-username').get(controller.getUserByUsername);

module.exports = router;
