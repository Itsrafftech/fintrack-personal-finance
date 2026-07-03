import { formatCurrency } from '../Dashboard/SummaryCards.jsx';

export default function TransactionList({
  transactions,
  categories,
  filters,
  onFilterChange,
  onDelete,
}) {
  return (
    <div className="transaction-list">
      <div className="list-header">
        <h3>Daftar Transaksi</h3>
        <div className="filters">
          <input
            type="month"
            value={filters.month}
            onChange={(e) => onFilterChange({ ...filters, month: e.target.value })}
          />
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
          >
            <option value="">Semua Tipe</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="empty-state">Belum ada transaksi untuk filter ini.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Kategori</th>
              <th>Deskripsi</th>
              <th>Jumlah</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.transaction_date?.slice(0, 10)}</td>
                <td>
                  <span
                    className="category-pill"
                    style={{ backgroundColor: `${t.category_color || '#94a3b8'}22`, color: t.category_color || '#64748b' }}
                  >
                    {t.category_name || 'Tanpa kategori'}
                  </span>
                </td>
                <td>{t.description || '-'}</td>
                <td className={t.type === 'income' ? 'amount-income' : 'amount-expense'}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </td>
                <td>
                  <button className="delete-btn" onClick={() => onDelete(t.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
