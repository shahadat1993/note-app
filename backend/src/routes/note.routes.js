import express from 'express';
import { body } from 'express-validator';
import { createNote, deleteNote, getNotes, updateNote } from '../controllers/note.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotes);
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required')
  ],
  validate,
  createNote
);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;