const captainController = require('../controllers/captain.controller');
const express = require('express');
const router = express.Router();
const { body } = require("express-validator")
const authMiddleware = require('../middlewares/auth.middleware');
const { addReview } = require('../controllers/captain.controller');

router.post('/register', [
    body('driverId').matches(/^\d{3}-\d{2}-\d{4}$/).withMessage('Driver ID must be in SSN format'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('zipCode').notEmpty().withMessage('Zip Code is required'),
    body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),
    body('vehicle.plate').notEmpty().withMessage('Vehicle plate is required'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['UberX', 'UberXX', 'UberXXL']).withMessage('Invalid vehicle type')
  ], captainController.registerCaptain);
    

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    captainController.loginCaptain
)


router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile)

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain)

router.delete('/:id', captainController.deleteCaptain);
router.get('/', captainController.listCaptains);
router.put('/:id', captainController.updateCaptain);
router.get('/search', captainController.searchCaptains);
router.post('/:id/video', captainController.uploadIntroVideo);

router.post('/:id/review', authMiddleware.authUser, addReview);

router.get('/:id', captainController.getCaptainById);

module.exports = router;