import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '../../types';

interface TrendChartProps {
  transactions: Transaction[];
}

export default function TrendChart({ transactions }: TrendChartProps) {
  const monthlyData = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((t) => {
    const monthKey = t.date.slice(0, 7);
    const existing = monthlyData.get(monthKey) || { income: 0, expenses: 0 };

    if (t.type === 'income') {
      existing.income += t.usd_amount;
    } else if (t.type === 'expense') {
      existing.expenses += t.usd_amount;
    }

    monthlyData.set(monthKey, existing);
  });

  const data = Array.from(monthlyData.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({
      month: new Date(month + '-01T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      'Net Profit': Number((values.income - values.expenses).toFixed(2)),
    }));

  return (
    <div className="bg-sv-dark rounded-xl border border-sv-gray p-5">
      <h3 className="text-sv-white font-semibold mb-4">Monthly Net Profit Trend</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
            />
            <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="Net Profit"
              stroke="#AAFF00"
              strokeWidth={2}
              dot={{ fill: '#AAFF00', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
