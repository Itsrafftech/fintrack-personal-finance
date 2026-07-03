-- FinTrack initial schema
-- Tables: categories, transactions, savings_goals

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    color VARCHAR(7) NOT NULL DEFAULT '#6366f1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    description VARCHAR(255),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

CREATE TABLE IF NOT EXISTS savings_goals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    target_amount NUMERIC(14, 2) NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
    target_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default categories
INSERT INTO categories (name, type, color) VALUES
    ('Salary', 'income', '#22c55e'),
    ('Freelance', 'income', '#16a34a'),
    ('Investment', 'income', '#0ea5e9'),
    ('Other Income', 'income', '#84cc16'),
    ('Food & Dining', 'expense', '#ef4444'),
    ('Transportation', 'expense', '#f97316'),
    ('Housing', 'expense', '#a855f7'),
    ('Utilities', 'expense', '#eab308'),
    ('Entertainment', 'expense', '#ec4899'),
    ('Healthcare', 'expense', '#14b8a6'),
    ('Shopping', 'expense', '#f43f5e'),
    ('Other Expense', 'expense', '#64748b')
ON CONFLICT (name) DO NOTHING;
