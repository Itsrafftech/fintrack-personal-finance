const BASE_URL = "https://fintrack-personal-finance-production-c1e6.up.railway.app/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Transactions
  getTransactions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/transactions${qs ? `?${qs}` : ''}`);
  },
  createTransaction: (data) =>
    request('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateTransaction: (id, data) =>
    request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: (type) => request(`/categories${type ? `?type=${type}` : ''}`),

  // Savings goals
  getSavingsGoals: () => request('/savings-goals'),
  createSavingsGoal: (data) =>
    request('/savings-goals', { method: 'POST', body: JSON.stringify(data) }),
  updateSavingsGoal: (id, data) =>
    request(`/savings-goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSavingsGoal: (id) => request(`/savings-goals/${id}`, { method: 'DELETE' }),

  // Summary
  getSummary: (month) => request(`/summary${month ? `?month=${month}` : ''}`),
  getSummaryByCategory: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/summary/by-category${qs ? `?${qs}` : ''}`);
  },
  getMonthlySummary: (year) => request(`/summary/monthly${year ? `?year=${year}` : ''}`),
};
