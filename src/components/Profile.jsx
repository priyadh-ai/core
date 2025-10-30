import { useState, useEffect } from 'react';
import { User, Target, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Profile({ userId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [currency, setCurrency] = useState('₹');
  const [weekStartDay, setWeekStartDay] = useState('monday');
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  async function loadProfile() {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      setProfile(data);
      setCurrency(data.currency);
      setWeekStartDay(data.week_start_day);
      setMonthlySavingsGoal(data.monthly_savings_goal);
    } else {
      await createProfile();
    }
  }

  async function createProfile() {
    const newProfile = {
      id: userId,
      currency: '₹',
      week_start_day: 'monday',
      monthly_savings_goal: 0,
    };

    const { data } = await supabase
      .from('user_profiles')
      .insert([newProfile])
      .select()
      .single();

    if (data) {
      setProfile(data);
    }
  }

  async function handleSave() {
    setLoading(true);

    const { error } = await supabase
      .from('user_profiles')
      .update({
        currency,
        week_start_day: weekStartDay,
        monthly_savings_goal: monthlySavingsGoal,
      })
      .eq('id', userId);

    setLoading(false);

    if (!error) {
      onClose();
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Profile Settings</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <User size={20} />
              <h3 style={styles.sectionTitle}>Preferences</h3>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={styles.select}
              >
                <option value="₹">₹ (INR)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Week Start Day</label>
              <select
                value={weekStartDay}
                onChange={(e) => setWeekStartDay(e.target.value)}
                style={styles.select}
              >
                <option value="monday">Monday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <Target size={20} />
              <h3 style={styles.sectionTitle}>Goals</h3>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Monthly Savings Goal</label>
              <input
                type="number"
                value={monthlySavingsGoal}
                onChange={(e) => setMonthlySavingsGoal(parseFloat(e.target.value) || 0)}
                placeholder="₹0"
                style={styles.input}
              />
            </div>
          </div>

          <button onClick={handleSave} disabled={loading} style={styles.saveBtn}>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 16px',
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    fontSize: '24px',
    color: '#111827',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    color: '#6b7280',
    lineHeight: 1,
  },
  content: {
    padding: '24px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    color: '#374151',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  saveBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
};
