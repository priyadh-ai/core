import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DEFAULT_CATEGORIES, QUICK_PRESETS } from '../lib/categories';
import { getDayOfWeek, formatDate } from '../lib/date-utils';
import { suggestCategory } from '../lib/ai-suggestions';

export default function AddExpense({ onClose, onSave, userId }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState(null);
  const [tag, setTag] = useState('');
  const [date, setDate] = useState(formatDate(new Date()));
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [isSaving, setIsSaving] = useState(false);
  const [savingAmount, setSavingAmount] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadCategories();
  }, [userId]);

  useEffect(() => {
    if (description) {
      const suggestion = suggestCategory(description);
      if (suggestion && !selectedCategory) {
        setSuggestedCategory(suggestion);
      } else {
        setSuggestedCategory(null);
      }
    } else {
      setSuggestedCategory(null);
    }
  }, [description, selectedCategory]);

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId);

    if (data && data.length > 0) {
      setCategories(data);
    } else {
      await createDefaultCategories();
    }
  }

  async function createDefaultCategories() {
    const newCategories = DEFAULT_CATEGORIES.map(cat => ({
      user_id: userId,
      ...cat,
      is_default: true,
    }));

    const { data } = await supabase
      .from('categories')
      .insert(newCategories)
      .select();

    if (data) {
      setCategories(data);
    }
  }

  function handleQuickPreset(preset) {
    setAmount(preset.amount.toString());
    setTag(preset.label);
    setSelectedCategory(preset.category);
    setDescription(`${preset.label}`);
  }

  function acceptSuggestion() {
    setSelectedCategory(suggestedCategory);
    setSuggestedCategory(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || !description) return;

    setLoading(true);

    const expense = {
      user_id: userId,
      amount: parseFloat(amount),
      description,
      category_name: selectedCategory || 'Misc',
      tag: tag || null,
      expense_date: date,
      expense_time: time,
      day_of_week: getDayOfWeek(date),
      is_saving: isSaving,
      saving_amount: isSaving ? parseFloat(savingAmount || amount) : 0,
    };

    const { error } = await supabase
      .from('expenses')
      .insert([expense]);

    setLoading(false);

    if (!error) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onSave();
        onClose();
      }, 800);
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add Expense</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.quickPresets}>
            {QUICK_PRESETS.map(preset => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleQuickPreset(preset)}
                style={styles.presetChip}
              >
                {preset.label} ₹{preset.amount}
              </button>
            ))}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="₹0"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you buy? (e.g., Dominos pizza)"
              style={styles.input}
              required
            />
          </div>

          {suggestedCategory && (
            <div style={styles.suggestion}>
              <span>Suggested category: <strong>{suggestedCategory}</strong></span>
              <button type="button" onClick={acceptSuggestion} style={styles.acceptBtn}>
                <Check size={16} /> Accept
              </button>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.select}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tag (optional)</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g., Movie, Petrol"
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.savingToggle}>
            <label style={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={isSaving}
                onChange={(e) => setIsSaving(e.target.checked)}
                style={styles.checkbox}
              />
              <span>Mark as Saving</span>
            </label>
          </div>

          {isSaving && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Saving Amount</label>
              <input
                type="number"
                value={savingAmount}
                onChange={(e) => setSavingAmount(e.target.value)}
                placeholder={`₹${amount || 0}`}
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.saveBtn}>
              {loading ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>

        {showToast && (
          <div style={styles.toast}>
            <Check size={20} /> Expense saved!
          </div>
        )}
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
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    animation: 'slideUp 0.3s ease-out',
    position: 'relative',
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
    color: '#6b7280',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s',
  },
  form: {
    padding: '24px',
  },
  quickPresets: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  presetChip: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    transition: 'all 0.2s',
  },
  formGroup: {
    marginBottom: '20px',
    flex: 1,
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
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: 'white',
    transition: 'border-color 0.2s',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  suggestion: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#eff6ff',
    border: '1px solid #3b82f6',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    animation: 'slideDown 0.3s ease-out',
  },
  acceptBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  savingToggle: {
    marginBottom: '20px',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  saveBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  toast: {
    position: 'absolute',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 0.3s ease-out',
  },
};
