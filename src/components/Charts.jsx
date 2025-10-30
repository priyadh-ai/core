import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#6366f1', '#6b7280'];

export function WeeklyBarChart({ weekDays, expenses }) {
  const data = weekDays.map((date, idx) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayExpenses = expenses.filter(exp => exp.expense_date === dateStr);
    const total = dayExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return {
      day: dayNames[idx],
      amount: total,
    };
  });

  return (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>Weekly Spending</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            formatter={(value) => `₹${value.toFixed(0)}`}
          />
          <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart({ expenses }) {
  const categoryTotals = {};

  expenses.forEach(exp => {
    const cat = exp.category_name || 'Misc';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(exp.amount);
  });

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(0)),
  }));

  if (data.length === 0) {
    return (
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Category Breakdown</h3>
        <div style={styles.emptyChart}>No expenses to display</div>
      </div>
    );
  }

  return (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>Category Breakdown</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            formatter={(value) => `₹${value}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SavingsTrendChart({ weekDays, expenses }) {
  const data = weekDays.map((date, idx) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayExpenses = expenses.filter(exp => exp.expense_date === dateStr && exp.is_saving);
    const savings = dayExpenses.reduce((sum, exp) => sum + Number(exp.saving_amount), 0);

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return {
      day: dayNames[idx],
      savings: savings,
    };
  });

  return (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>Savings Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            formatter={(value) => `₹${value.toFixed(0)}`}
          />
          <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  chartCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
  },
  emptyChart: {
    height: '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    fontSize: '14px',
  },
};
