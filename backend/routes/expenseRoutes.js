const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

// All expense routes are protected
router.use(protect);

// ─────────────────────────────────────────────────────────
// POST /api/expenses — Create expense with idempotency
// ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { idempotencyKey, amount, category, description, date } = req.body;

    // Validate idempotency key exists
    if (!idempotencyKey) {
      return res.status(400).json({ message: 'Idempotency key is required' });
    }

    // Step 1: Check if request was already processed (idempotency check)
    const existingExpense = await Expense.findOne({ idempotencyKey, user: req.user._id });
    if (existingExpense) {
      return res.status(200).json({
        message: 'Duplicate request — returning existing expense',
        expense: existingExpense,
        isDuplicate: true,
      });
    }

    // Step 2: Create new expense (scoped to current user)
    const expense = await Expense.create({
      user: req.user._id,
      idempotencyKey,
      amount,
      category,
      description,
      date: date || Date.now(),
    });

    res.status(201).json({
      message: 'Expense created successfully',
      expense,
      isDuplicate: false,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (race condition safety net)
    if (error.code === 11000) {
      const existing = await Expense.findOne({ idempotencyKey: req.body.idempotencyKey });
      return res.status(200).json({
        message: 'Duplicate request — returning existing expense',
        expense: existing,
        isDuplicate: true,
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ─────────────────────────────────────────────────────────
// GET /api/expenses — Get current user's expenses
// ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, sort } = req.query;

    // Build filter — always scoped to current user
    const filter = { user: req.user._id };
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Build sort (default: newest first)
    const sortOrder = sort === 'oldest' ? { date: 1 } : { date: -1 };

    const expenses = await Expense.find(filter).sort(sortOrder);

    // Calculate total amount
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.status(200).json({
      expenses,
      total,
      count: expenses.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ─────────────────────────────────────────────────────────
// DELETE /api/expenses/:id — Delete own expense
// ─────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    // Only delete if the expense belongs to the current user
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully', expense });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
