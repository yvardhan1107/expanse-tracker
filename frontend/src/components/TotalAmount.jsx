export default function TotalAmount({ total, count, category }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="total-card">
      <div className="total-content">
        <div className="total-info">
          <p className="total-label">
            {category && category !== 'All' ? `Total — ${category}` : 'Total Expenses'}
          </p>
          <h2 className="total-amount">{formatAmount(total)}</h2>
          <p className="total-count">
            {count} expense{count !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <div className="total-icon-wrapper">
          <div className="total-icon">💸</div>
        </div>
      </div>
      <div className="total-glow"></div>
    </div>
  );
}
