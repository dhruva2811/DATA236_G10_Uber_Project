const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');
const { authUser, authAdmin } = require('../middlewares/auth.middleware');

router.get('/', billingController.getAllBillings);
router.get('/user/:userId', authUser, billingController.getBillingByUser);
router.get('/ride/:rideId', authUser, billingController.getBillingByRide);
router.get('/by-driver/:driverId', billingController.getBillingByDriver);
router.post('/', authUser, billingController.createBilling);
router.put('/:id', authUser, billingController.updateBilling);
router.delete('/:id', authAdmin, billingController.deleteBilling);
router.get('/search', authAdmin, billingController.searchBilling);

module.exports = router;
