import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import { Note } from '../models/note.js';

// ===============================================
// GET ALL NOTES (pagination + search + tag)
// ===============================================
export const getAllNotes = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      tag,
      search = '',
    } = req.query;

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const filter = { userId: req.user._id };

    if (tag) {
      filter.tag = tag;
    }

    if (search.trim() !== '') {
      filter.$text = { $search: search.trim() };
    }

    const skip = (pageNumber - 1) * perPageNumber;

    const [notes, totalNotes] = await Promise.all([
      Note.find(filter).skip(skip).limit(perPageNumber),
      Note.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalNotes / perPageNumber) || 1;

    res.status(200).json({
      page: pageNumber,
      perPage: perPageNumber,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// GET NOTE BY ID
// ===============================================
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({ _id: noteId, userId: req.user._id });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json({ note });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// CREATE NOTE
// ===============================================
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json({ note });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// UPDATE NOTE
// ===============================================
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json({ note: updatedNote });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// DELETE NOTE
// ===============================================
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });

    if (!deletedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json({ note: deletedNote });
  } catch (error) {
    next(error);
  }
};
