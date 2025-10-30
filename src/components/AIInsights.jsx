import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { generateInsights } from '../lib/ai-suggestions';

export default function AIInsights({ expenses }) {
  const insights = generateInsights(expenses);

  if (insights.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'savings':
        return <TrendingUp size={20} />;
      case 'optimization':
        return <Lightbulb size={20} />;
      case 'pattern':
        return <AlertCircle size={20} />;
      default:
        return <Lightbulb size={20} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'savings':
        return '#10b981';
      case 'optimization':
        return '#f59e0b';
      case 'pattern':
        return '#3b82f6';
      default:
        return '#6366f1';
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Smart Insights</h3>
      <div style={styles.insightsList}>
        {insights.map((insight, idx) => (
          <div
            key={idx}
            style={{
              ...styles.insightCard,
              borderLeft: `4px solid ${getColor(insight.type)}`,
            }}
          >
            <div style={{ ...styles.iconWrapper, backgroundColor: `${getColor(insight.type)}15` }}>
              <div style={{ color: getColor(insight.type), display: 'flex' }}>
                {getIcon(insight.type)}
              </div>
            </div>
            <div style={styles.insightContent}>
              <p style={styles.insightMessage}>{insight.message}</p>
              {insight.action && (
                <button style={styles.actionBtn}>{insight.action}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '24px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    gap: '16px',
    animation: 'slideIn 0.4s ease-out',
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  insightContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  insightMessage: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#374151',
  },
  actionBtn: {
    alignSelf: 'flex-start',
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
};
