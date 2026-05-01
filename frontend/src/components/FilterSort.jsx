const CATEGORIES = ['All', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other'];

export default function FilterSort({ category, sort, onCategoryChange, onSortChange }) {
  return (
    <div className="filter-sort-card">
      <div className="filter-sort-inner">
        <div className="filter-group">
          <label htmlFor="filter-category">
            <span className="label-icon">🔍</span> Filter
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? '🌐 All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-order">
            <span className="label-icon">📊</span> Sort
          </label>
          <select
            id="sort-order"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">🔽 Newest First</option>
            <option value="oldest">🔼 Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
