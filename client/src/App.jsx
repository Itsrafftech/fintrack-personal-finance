import { useEffect, useMemo, useState, useCallback } from 'react';
import { api } from './api/api.js';
import SummaryCards from './components/Dashboard/SummaryCards.jsx';
import TransactionForm from './components/Transactions/TransactionForm.jsx';
import TransactionList from './components/Transactions/TransactionList.jsx';
import CategoryPieChart from './components/Charts/CategoryPieChart.jsx';
import MonthlyLineChart from './components/Charts/MonthlyLineChart.jsx';
import SavingsGoalForm from './components/SavingsGoals/SavingsGoalForm.jsx';
import SavingsGoalList from './components/SavingsGoals/SavingsGoalList.jsx';
import './App.css';

const currentMonth = () => new Date().toISOString().slice(0, 7);

export default function App() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [filters, setFilters] = useState({ month: currentMonth(), category: '', type: '' });
  const [error, setError] = useState('');

  const loadTransactions = useCallback(async () => {
    const params = {};
    if (filters.month) params.month = filters.month;
    if (filters.category) params.category = filters.category;
    if (filters.type) params.type = filters.type;
    const data = await api.getTransactions(params);
    setTransactions(data);
  }, [filters]);

  const loadSummary = useCallback(async () => {
    const [s, byCategory, monthly] = await Promise.all([
      api.getSummary(filters.month),
      api.getSummaryByCategory({ month: filters.month, type: 'expense' }),
      api.getMonthlySummary(filters.month.slice(0, 4)),
    ]);
    setSummary(s);
    setCategoryBreakdown(byCategory);
    setMonthlyTrend(monthly);
  }, [filters.month]);

  const loadSavingsGoals = useCallback(async () => {
    setSavingsGoals(await api.getSavingsGoals());
  }, []);

  const loadCategories = useCallback(async () => {
    setCategories(await api.getCategories());
  }, []);

  useEffect(() => {
    loadCategories().catch((e) => setError(e.message));
    loadSavingsGoals().catch((e) => setError(e.message));
  }, [loadCategories, loadSavingsGoals]);

  useEffect(() => {
    loadTransactions().catch((e) => setError(e.message));
    loadSummary().catch((e) => setError(e.message));
  }, [loadTransactions, loadSummary]);

  const handleCreateTransaction = async (data) => {
    await api.createTransaction(data);
    await Promise.all([loadTransactions(), loadSummary()]);
  };

  const handleDeleteTransaction = async (id) => {
    await api.deleteTransaction(id);
    await Promise.all([loadTransactions(), loadSummary()]);
  };

  const handleCreateGoal = async (data) => {
    await api.createSavingsGoal(data);
    await loadSavingsGoals();
  };

  const handleAddProgress = async (goal, newAmount) => {
    await api.updateSavingsGoal(goal.id, { current_amount: newAmount });
    await loadSavingsGoals();
  };

  const handleDeleteGoal = async (id) => {
    await api.deleteSavingsGoal(id);
    await loadSavingsGoals();
  };

  const monthLabel = useMemo(() => {
    if (!filters.month) return '';
    const [y, m] = filters.month.split('-');
    return new Date(Number(y), Number(m) - 1).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });
  }, [filters.month]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>FinTrack</h1>
        <p>Personal Finance Dashboard — {monthLabel}</p>
      </header>

      {error && <div className="global-error">{error}</div>}

      <SummaryCards summary={summary} />

      <section className="grid-2">
        <CategoryPieChart data={categoryBreakdown} />
        <MonthlyLineChart data={monthlyTrend} />
      </section>

      <section className="grid-2">
        <TransactionForm categories={categories} onSubmit={handleCreateTransaction} />
        <TransactionList
          transactions={transactions}
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
          onDelete={handleDeleteTransaction}
        />
      </section>

      <section className="grid-2">
        <SavingsGoalForm onSubmit={handleCreateGoal} />
        <SavingsGoalList goals={savingsGoals} onAddProgress={handleAddProgress} onDelete={handleDeleteGoal} />
      </section>
    </div>
  );
}
