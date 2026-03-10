import express from 'express';
import { body } from 'express-validator';
import { changePassword, updateProfile } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.use(protect);

router.put(
  '/profile',
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('email').optional().isEmail().withMessage('Valid email required')
  ],
  validate,
  updateProfile
);

router.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  validate,
  changePassword
);

export default router;