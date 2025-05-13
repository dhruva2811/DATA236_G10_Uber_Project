const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');
const { authUser, authAdmin } = require('../middlewares/auth.middleware');


// Admin: get all billing records
router.get('/', billingController.getAllBillings);

// User: get their own billing records
router.get('/user/:userId', authUser, billingController.getBillingByUser);

// Get billing by ride ID
router.get('/ride/:rideId', authUser, billingController.getBillingByRide);

router.get('/by-driver/:driverId', billingController.getBillingByDriver);

router.post('/', authUser, billingController.createBilling);
router.put('/:id', authUser, billingController.updateBilling);
router.delete('/:id', authAdmin, billingController.deleteBilling);
router.get('/search', authAdmin, billingController.searchBilling);

module.exports = router;
