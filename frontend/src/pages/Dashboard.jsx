import { useState, useEffect, useCallback } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterSort from '../components/FilterSort';
import TotalAmount from '../components/TotalAmount';
import { useAuth } from '../context/AuthContext';
import { createExpense, getExpenses, deleteExpense } from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch expenses from API
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getExpenses(category, sort);
      setExpenses(data.expenses);
      setTotal(data.total);
      setCount(data.count);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        return;
      }
      setError('Failed to load expenses. Make sure the backend is running.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [category, sort, logout]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (expenseData) => {
    await createExpense(expenseData);
    await fetchExpenses();
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      await fetchExpenses();
    } catch (err) {
      setError('Failed to delete expense.');
    }
  };

  return (
    <div className="app">
      {/* Animated background */}
      <div className="bg-gradient"></div>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      <div className="container">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">💰</span>
              <div>
                <h1>ExpenseTracker</h1>
                <p className="tagline">Smart spending, clear insights</p>
              </div>
            </div>
            <div className="header-right">
              <div className="user-info">
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-email">{user?.email}</span>
                </div>
              </div>
              <button className="btn-logout" onClick={logout}>
                🚪 Logout
              </button>
            </div>
          </div>
        </header>

        {/* Global error */}
        {error && (
          <div className="alert alert-error global-alert">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Main Layout */}
        <main className="main-grid">
          <section className="left-column">
            <ExpenseForm onExpenseAdded={handleAddExpense} />
          </section>

          <section className="right-column">
            <TotalAmount total={total} count={count} category={category} />
            <FilterSort
              category={category}
              sort={sort}
              onCategoryChange={setCategory}
              onSortChange={setSort}
            />
            <ExpenseList
              expenses={expenses}
              onDelete={handleDeleteExpense}
              loading={loading}
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>Built with ❤️ using MERN Stack &bull; Idempotent API Design</p>
        </footer>
      </div>
    </div>
  );
}
