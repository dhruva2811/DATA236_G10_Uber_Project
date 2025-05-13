const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth.authUser, supportController.createTicket);
router.get('/user/:userId', auth.authUser, supportController.getTicketsByUser);
router.get('/', supportController.getAllTickets);
router.patch('/:id/status', auth.authAdmin, supportController.updateTicketStatus);


module.exports = router;
