// ✅ support.routes.js
const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support.controller');
const auth = require('../middlewares/auth.middleware');

// User raises a ticket
router.post('/', auth.authUser, supportController.createTicket);

// User views their own tickets
router.get('/user/:userId', auth.authUser, supportController.getTicketsByUser);

// Admin views all tickets (optional)
router.get('/', supportController.getAllTickets);


router.patch('/:id/status', auth.authAdmin, supportController.updateTicketStatus);


module.exports = router;