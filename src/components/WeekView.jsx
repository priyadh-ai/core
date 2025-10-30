import { formatDateDisplay } from '../lib/date-utils';

export default function WeekView({ weekDays, expenses }) {
  const getDayExpenses = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return expenses.filter(exp => exp.expense_date === dateStr);
  };

  const getDayTotal = (dayExpenses) => {
    return dayExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  };

  const getDaySavings = (dayExpenses) => {
    return dayExpenses.filter(exp => exp.is_saving).reduce((sum, exp) => sum + Number(exp.saving_amount), 0);
  };

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div style={styles.container}>
      {weekDays.map((date, idx) => {
        const dayExpenses = getDayExpenses(date);
        const total = getDayTotal(dayExpenses);
        const savings = getDaySavings(dayExpenses);
        const spent = total - (dayExpenses.some(e => e.is_saving) ? 0 : 0);

        return (
          <div key={idx} style={styles.dayCard}>
            <div style={styles.dayHeader}>
              <h3 style={styles.dayName}>{dayNames[idx]}</h3>
              <span style={styles.date}>{formatDateDisplay(date)}</span>
            </div>

            <div style={styles.dayStats}>
              <div style={styles.stat}>
                <span style={styles.statLabel}>Spent</span>
                <span style={styles.statValue}>₹{total.toFixed(0)}</span>
              </div>
              {savings > 0 && (
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Saved</span>
                  <span style={{...styles.statValue, color: '#10b981'}}>₹{savings.toFixed(0)}</span>
                </div>
              )}
            </div>

            {dayExpenses.length > 0 ? (
              <div style={styles.expenseList}>
                {dayExpenses.map(exp => (
                  <div key={exp.id} style={styles.expenseItem}>
                    <div style={styles.expenseInfo}>
                      <span style={styles.expenseDesc}>{exp.description}</span>
                      <span style={styles.expenseCat}>{exp.category_name}</span>
                    </div>
                    <span style={{...styles.expenseAmount, color: exp.is_saving ? '#10b981' : '#1f2937'}}>
                      ₹{Number(exp.amount).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.empty}>No expenses</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  dayCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  },
  dayHeader: {
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #f3f4f6',
  },
  dayName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  date: {
    fontSize: '14px',
    color: '#6b7280',
  },
  dayStats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
  },
  expenseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  expenseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  expenseInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  expenseDesc: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
  },
  expenseCat: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  expenseAmount: {
    fontSize: '16px',
    fontWeight: '600',
  },
  empty: {
    fontSize: '14px',
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '16px 0',
  },
};
