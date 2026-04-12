import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Transaction } from '../../types';

interface ClubBreakdownChartProps {
  transactions: Transaction[];
}

const COLORS = ['#AAFF00', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

export default function ClubBreakdownChart({ transactions }: ClubBreakdownChartProps) {
  const clubIncome = new Map<string, number>();

  transactions
    .filter((t) => t.type === 'income' && t.club)
    .forEach((t) => {
      const name = t.club!.name;
      clubIncome.set(name, (clubIncome.get(name) || 0) + t.usd_amount);
    });

  const data = Array.from(clubIncome.entries())
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="bg-sv-dark rounded-xl border border-sv-gray p-5">
        <h3 className="text-sv-white font-semibold mb-4">Income by Club</h3>
        <p className="text-sv-gray-text text-sm text-center py-12">No income data available</p>
      </div>
    );
  }

  return (
    <div className="bg-sv-dark rounded-xl border border-sv-gray p-5">
      <h3 className="text-sv-white font-semibold mb-4">Income by Club</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, undefined]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => <span style={{ color: '#9CA3AF' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
