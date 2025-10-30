import { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, UserCircle, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import { getCurrentWeekMonday, getLastWeekMonday, getWeekRange, getWeekDays } from './lib/date-utils';
import AddExpense from './components/AddExpense';
import WeekView from './components/WeekView';
import WeekSummary from './components/WeekSummary';
import { WeeklyBarChart, CategoryPieChart, SavingsTrendChart } from './components/Charts';
import AIInsights from './components/AIInsights';
import Profile from './components/Profile';
import Auth from './components/Auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [weekStart, setWeekStart] = useState(getCurrentWeekMonday());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user, weekStart]);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    setLoading(false);

    supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user || null);
      })();
    });
  }

  async function loadExpenses() {
    const { start, end } = getWeekRange(weekStart);
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .gte('expense_date', startStr)
      .lte('expense_date', endStr)
      .order('expense_date', { ascending: true });

    setExpenses(data || []);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  function handleThisWeek() {
    setWeekStart(getCurrentWeekMonday());
  }

  function handleLastWeek() {
    setWeekStart(getLastWeekMonday());
  }

  function handlePrevWeek() {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  }

  function handleNextWeek() {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  }

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <Auth onAuth={setUser} />;
  }

  const { start, end } = getWeekRange(weekStart);
  const weekDays = getWeekDays(weekStart);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.appTitle}>Expense Tracker</h1>
          <div style={styles.headerActions}>
            <button onClick={() => setShowProfile(true)} style={styles.iconBtn}>
              <UserCircle size={24} />
            </button>
            <button onClick={handleSignOut} style={styles.iconBtn}>
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.controls}>
          <div style={styles.weekSelector}>
            <button onClick={handlePrevWeek} style={styles.navBtn}>
              <ChevronLeft size={20} />
            </button>
            <div style={styles.weekButtons}>
              <button onClick={handleThisWeek} style={styles.weekBtn}>This Week</button>
              <button onClick={handleLastWeek} style={styles.weekBtn}>Last Week</button>
            </div>
            <button onClick={handleNextWeek} style={styles.navBtn}>
              <ChevronRight size={20} />
            </button>
          </div>

          <button onClick={() => setShowAddExpense(true)} style={styles.addBtn}>
            <Plus size={20} /> Add Expense
          </button>
        </div>

        <WeekSummary weekStart={start} weekEnd={end} expenses={expenses} />

        <WeekView weekDays={weekDays} expenses={expenses} />

        <div style={styles.chartsGrid}>
          <WeeklyBarChart weekDays={weekDays} expenses={expenses} />
          <CategoryPieChart expenses={expenses} />
          <SavingsTrendChart weekDays={weekDays} expenses={expenses} />
        </div>

        <AIInsights expenses={expenses} />
      </main>

      {showAddExpense && (
        <AddExpense
          userId={user.id}
          onClose={() => setShowAddExpense(false)}
          onSave={loadExpenses}
        />
      )}

      {showProfile && (
        <Profile
          userId={user.id}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#6b7280',
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: '28px',
    color: '#111827',
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  iconBtn: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#6b7280',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  weekSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navBtn: {
    padding: '8px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
  },
  weekButtons: {
    display: 'flex',
    gap: '8px',
  },
  weekBtn: {
    padding: '10px 20px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    transition: 'all 0.2s',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  chartsGrid: {
    marginTop: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
  },
};
