import { useState } from 'react';

export default function SavingsGoalForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', target_amount: '', target_date: '' });
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.target_amount || Number(form.target_amount) <= 0) {
      setError('Nama dan target jumlah wajib diisi');
      return;
    }
    try {
      await onSubmit({ ...form, target_amount: Number(form.target_amount) });
      setForm({ name: '', target_amount: '', target_date: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="savings-goal-form" onSubmit={handleSubmit}>
      <h3>Set Target Tabungan Baru</h3>
      <label>
        Nama Target
        <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Dana Darurat" />
      </label>
      <label>
        Target Jumlah (Rp)
        <input
          type="number"
          min="0"
          step="1000"
          value={form.target_amount}
          onChange={handleChange('target_amount')}
          placeholder="0"
        />
      </label>
      <label>
        Target Tanggal
        <input type="date" value={form.target_date} onChange={handleChange('target_date')} />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="submit-btn">
        Buat Target
      </button>
    </form>
  );
}
