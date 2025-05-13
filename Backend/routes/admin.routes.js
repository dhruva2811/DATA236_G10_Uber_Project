const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authUser } = require('../middlewares/auth.middleware'); // use authUser for now
const { body } = require('express-validator');
const { authAdmin } = require('../middlewares/auth.middleware');

router.post('/register', [
  body('adminId').matches(/^\d{3}-\d{2}-\d{4}$/),
  body('firstname').notEmpty(),
  body('lastname').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], adminController.registerAdmin);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], adminController.loginAdmin);

// ✅ New Analytics Route
router.get('/analytics/overview', authUser, adminController.getAnalyticsOverview);
router.get('/analytics/revenue-today', authAdmin, adminController.getTodayRevenue);
module.exports = router;
