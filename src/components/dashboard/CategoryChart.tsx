import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '../../types';

interface CategoryChartProps {
  transactions: Transaction[];
}

const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16', '#06B6D4'];

export default function CategoryChart({ transactions }: CategoryChartProps) {
  const categoryExpenses = new Map<string, number>();

  transactions
    .filter((t) => t.type === 'expense' && t.category)
    .forEach((t) => {
      const name = t.category!.name;
      categoryExpenses.set(name, (categoryExpenses.get(name) || 0) + t.usd_amount);
    });

  const data = Array.from(categoryExpenses.entries())
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  if (data.length === 0) {
    return (
      <div className="bg-sv-dark rounded-xl border border-sv-gray p-5">
        <h3 className="text-sv-white font-semibold mb-4">Expenses by Category</h3>
        <p className="text-sv-gray-text text-sm text-center py-12">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="bg-sv-dark rounded-xl border border-sv-gray p-5">
      <h3 className="text-sv-white font-semibold mb-4">Expenses by Category</h3>
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
              formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
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
