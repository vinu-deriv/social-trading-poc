import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './WinRatePieChart.css';

interface WinRatePieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const WinRatePieChart: React.FC<WinRatePieChartProps> = ({ data }) => {
  return (
    <div className="win-rate-pie-chart">
      <h3 className="win-rate-pie-chart__title">Win Rate by Strategy</h3>
      <div className="win-rate-pie-chart__container">
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
              label={({ name, value }) => `${name}\n${value.toFixed(1)}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WinRatePieChart;
