const express = require('express');
const router = express.Router();
const controller = require('../controllers/rideMedia.controller');
const { authUser } = require('../middlewares/auth.middleware');

router.post('/upload', authUser, controller.uploadMedia);
router.get('/ride/:rideId', controller.getMediaByRide);

module.exports = router;
