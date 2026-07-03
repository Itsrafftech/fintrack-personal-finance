import { useState } from 'react';

const today = () => new Date().toISOString().slice(0, 10);

export default function TransactionForm({ categories, onSubmit }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category_id: '',
    description: '',
    transaction_date: today(),
  });
  const [error, setError] = useState('');

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleTypeChange = (type) =>
    setForm((prev) => ({ ...prev, type, category_id: '' }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Jumlah harus lebih dari 0');
      return;
    }
    try {
      await onSubmit({
        ...form,
        amount: Number(form.amount),
        category_id: form.category_id || null,
      });
      setForm({ type: form.type, amount: '', category_id: '', description: '', transaction_date: today() });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>Tambah Transaksi</h3>

      <div className="type-toggle">
        <button
          type="button"
          className={form.type === 'income' ? 'active income' : ''}
          onClick={() => handleTypeChange('income')}
        >
          Pemasukan
        </button>
        <button
          type="button"
          className={form.type === 'expense' ? 'active expense' : ''}
          onClick={() => handleTypeChange('expense')}
        >
          Pengeluaran
        </button>
      </div>

      <label>
        Jumlah (Rp)
        <input
          type="number"
          min="0"
          step="1000"
          value={form.amount}
          onChange={handleChange('amount')}
          placeholder="0"
          required
        />
      </label>

      <label>
        Kategori
        <select value={form.category_id} onChange={handleChange('category_id')}>
          <option value="">Pilih kategori</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Deskripsi
        <input
          type="text"
          value={form.description}
          onChange={handleChange('description')}
          placeholder="Opsional"
        />
      </label>

      <label>
        Tanggal
        <input type="date" value={form.transaction_date} onChange={handleChange('transaction_date')} />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="submit-btn">
        Simpan Transaksi
      </button>
    </form>
  );
}
