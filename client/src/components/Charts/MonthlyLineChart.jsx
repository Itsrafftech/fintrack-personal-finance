import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function MonthlyLineChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Pemasukan',
        data: data.map((d) => d.income),
        borderColor: '#22c55e',
        backgroundColor: '#22c55e33',
        tension: 0.3,
      },
      {
        label: 'Pengeluaran',
        data: data.map((d) => d.expense),
        borderColor: '#ef4444',
        backgroundColor: '#ef444433',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>Tren Bulanan</h3>
      {data.length > 0 ? (
        <Line
          data={chartData}
          options={{
            plugins: { legend: { position: 'bottom' } },
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
          }}
        />
      ) : (
        <p className="empty-state">Belum ada data untuk ditampilkan.</p>
      )}
    </div>
  );
}
