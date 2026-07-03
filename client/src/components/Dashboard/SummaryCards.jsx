const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
    value || 0
  );

export default function SummaryCards({ summary }) {
  const { total_income = 0, total_expense = 0, balance = 0 } = summary || {};

  return (
    <div className="summary-cards">
      <div className="card card-income">
        <span className="card-label">Total Pemasukan</span>
        <span className="card-value">{formatCurrency(total_income)}</span>
      </div>
      <div className="card card-expense">
        <span className="card-label">Total Pengeluaran</span>
        <span className="card-value">{formatCurrency(total_expense)}</span>
      </div>
      <div className={`card ${balance >= 0 ? 'card-balance-positive' : 'card-balance-negative'}`}>
        <span className="card-label">Saldo</span>
        <span className="card-value">{formatCurrency(balance)}</span>
      </div>
    </div>
  );
}

export { formatCurrency };
