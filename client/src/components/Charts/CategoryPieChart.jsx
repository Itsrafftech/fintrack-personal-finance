import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart({ data }) {
  const hasData = data && data.length > 0 && data.some((d) => d.total > 0);

  const chartData = {
    labels: data.map((d) => d.category_name || 'Tanpa kategori'),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: data.map((d) => d.category_color || '#94a3b8'),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>Pengeluaran per Kategori</h3>
      {hasData ? (
        <Pie
          data={chartData}
          options={{
            plugins: { legend: { position: 'bottom' } },
            maintainAspectRatio: false,
          }}
        />
      ) : (
        <p className="empty-state">Belum ada data untuk ditampilkan.</p>
      )}
    </div>
  );
}
