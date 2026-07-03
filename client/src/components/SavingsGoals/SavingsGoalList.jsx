import { useState } from 'react';
import { formatCurrency } from '../Dashboard/SummaryCards.jsx';

export default function SavingsGoalList({ goals, onAddProgress, onDelete }) {
  const [amounts, setAmounts] = useState({});

  const handleAmountChange = (id, value) => setAmounts((prev) => ({ ...prev, [id]: value }));

  const handleAddProgress = (goal) => {
    const add = Number(amounts[goal.id] || 0);
    if (add <= 0) return;
    onAddProgress(goal, Number(goal.current_amount) + add);
    setAmounts((prev) => ({ ...prev, [goal.id]: '' }));
  };

  if (goals.length === 0) {
    return <p className="empty-state">Belum ada target tabungan. Buat satu di atas.</p>;
  }

  return (
    <div className="savings-goal-list">
      {goals.map((goal) => {
        const progress = Math.min(100, (Number(goal.current_amount) / Number(goal.target_amount)) * 100);
        return (
          <div className="savings-goal-card" key={goal.id}>
            <div className="goal-header">
              <h4>{goal.name}</h4>
              <button className="delete-btn" onClick={() => onDelete(goal.id)}>
                Hapus
              </button>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="goal-meta">
              <span>
                {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
              </span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            {goal.target_date && (
              <p className="goal-date">Target: {goal.target_date.slice(0, 10)}</p>
            )}
            <div className="goal-add-progress">
              <input
                type="number"
                min="0"
                placeholder="Tambah jumlah"
                value={amounts[goal.id] || ''}
                onChange={(e) => handleAmountChange(goal.id, e.target.value)}
              />
              <button onClick={() => handleAddProgress(goal)}>Tambah</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
