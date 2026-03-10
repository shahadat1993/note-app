import Note from '../models/Note.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ isPinned: -1, updatedAt: -1 });
  res.status(200).json(notes);
});

export const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags, isPinned } = req.body;

  const note = await Note.create({
    user: req.user._id,
    title,
    content,
    tags: tags || [],
    isPinned: !!isPinned
  });

  res.status(201).json(note);
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  note.title = req.body.title ?? note.title;
  note.content = req.body.content ?? note.content;
  note.tags = req.body.tags ?? note.tags;
  note.isPinned = req.body.isPinned ?? note.isPinned;

  const updated = await note.save();
  res.status(200).json(updated);
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  res.status(200).json({ message: 'Note deleted successfully' });
});