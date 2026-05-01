import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://expanse-tracker-1-2txk.onrender.com/api/expenses';

// Create a new expense (with idempotency key)
export const createExpense = async (expenseData) => {
  const response = await axios.post(API_BASE, expenseData);
  return response.data;
};

// Get expenses with optional filters
export const getExpenses = async (category = 'All', sort = 'newest') => {
  const params = new URLSearchParams();
  if (category && category !== 'All') {
    params.append('category', category);
  }
  if (sort === 'oldest') {
    params.append('sort', 'oldest');
  }

  const response = await axios.get(`${API_BASE}?${params.toString()}`);
  return response.data;
};

// Delete an expense
export const deleteExpense = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};
