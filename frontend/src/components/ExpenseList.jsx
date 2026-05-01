const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Health: '💊',
  Education: '📚',
  Other: '📦',
};

const CATEGORY_COLORS = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Entertainment: '#a855f7',
  Shopping: '#ec4899',
  Bills: '#6366f1',
  Health: '#10b981',
  Education: '#14b8a6',
  Other: '#64748b',
};

export default function ExpenseList({ expenses, onDelete, loading }) {
  if (loading) {
    return (
      <div className="expense-list-card">
        <div className="list-header">
          <h2>💳 Recent Expenses</h2>
        </div>
        <div className="loading-container">
          <div className="loading-skeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-item">
                <div className="skeleton-circle"></div>
                <div className="skeleton-lines">
                  <div className="skeleton-line long"></div>
                  <div className="skeleton-line short"></div>
                </div>
                <div className="skeleton-line amount"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="expense-list-card">
        <div className="list-header">
          <h2>💳 Recent Expenses</h2>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No expenses yet</h3>
          <p>Start tracking your spending by adding your first expense above.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="expense-list-card">
      <div className="list-header">
        <h2>💳 Recent Expenses</h2>
        <span className="expense-count">{expenses.length} item{expenses.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="expense-items">
        {expenses.map((expense, index) => (
          <div
            key={expense._id}
            className="expense-item"
            style={{
              '--item-delay': `${index * 0.05}s`,
              '--category-color': CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other,
            }}
          >
            <div className="expense-item-left">
              <div
                className="category-badge"
                style={{ background: `${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other}20` }}
              >
                <span className="category-emoji">
                  {CATEGORY_ICONS[expense.category] || '📦'}
                </span>
              </div>
              <div className="expense-details">
                <h4 className="expense-desc">{expense.description}</h4>
                <div className="expense-meta">
                  <span
                    className="category-tag"
                    style={{
                      background: `${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other}15`,
                      color: CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other,
                    }}
                  >
                    {expense.category}
                  </span>
                  <span className="expense-date">{formatDate(expense.date)}</span>
                </div>
              </div>
            </div>
            <div className="expense-item-right">
              <span className="expense-amount">{formatAmount(expense.amount)}</span>
              <button
                className="btn-delete"
                onClick={() => onDelete(expense._id)}
                title="Delete expense"
                aria-label="Delete expense"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
