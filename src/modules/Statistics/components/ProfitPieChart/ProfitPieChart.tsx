import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './ProfitPieChart.css';

interface ProfitPieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ProfitPieChart: React.FC<ProfitPieChartProps> = ({ data }) => {
  return (
    <div className="profit-pie-chart">
      <h3 className="profit-pie-chart__title">Profit Distribution by Strategy</h3>
      <div className="profit-pie-chart__container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, value }) => `${name}\n$${Math.abs(value).toLocaleString()}`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className={entry.value < 0 ? 'loss-cell' : 'profit-cell'}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${Math.abs(value).toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitPieChart;
