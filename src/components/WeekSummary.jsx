import { formatDateDisplay } from '../lib/date-utils';

export default function WeekSummary({ weekStart, weekEnd, expenses }) {
  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalSaved = expenses
    .filter(exp => exp.is_saving)
    .reduce((sum, exp) => sum + Number(exp.saving_amount), 0);
  const avgPerDay = totalSpent / 7;

  const dailyTotals = {};
  expenses.forEach(exp => {
    dailyTotals[exp.expense_date] = (dailyTotals[exp.expense_date] || 0) + Number(exp.amount);
  });

  const highestDay = Object.entries(dailyTotals).reduce(
    (max, [date, amount]) => (amount > max.amount ? { date, amount } : max),
    { date: null, amount: 0 }
  );

  return (
    <div style={styles.banner}>
      <div style={styles.weekInfo}>
        <span style={styles.weekLabel}>Week:</span>
        <span style={styles.weekRange}>
          {formatDateDisplay(weekStart)} – {formatDateDisplay(weekEnd)}
        </span>
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Spent</span>
          <span style={styles.statValue}>₹{totalSpent.toFixed(0)}</span>
        </div>

        {totalSaved > 0 && (
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Saved</span>
            <span style={{...styles.statValue, color: '#10b981'}}>₹{totalSaved.toFixed(0)}</span>
          </div>
        )}

        <div style={styles.statItem}>
          <span style={styles.statLabel}>Avg/day</span>
          <span style={styles.statValue}>₹{avgPerDay.toFixed(0)}</span>
        </div>

        {highestDay.date && (
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Highest</span>
            <span style={styles.statValue}>₹{highestDay.amount.toFixed(0)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  banner: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    marginBottom: '24px',
  },
  weekInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f3f4f6',
  },
  weekLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  weekRange: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '24px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
  },
};
