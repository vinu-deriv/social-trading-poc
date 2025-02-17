import React from 'react';
import './CopierOverviewContent.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const CopierOverviewContent: React.FC = () => {
  // Mock data for the dashboard metrics
  const metrics = {
    totalCopiers: 125,
    totalCapital: 1000000, // e.g. dollars
    winRate: 75, // in percentage
    totalPnL: 50000, // total profit or loss
    avgPnL: 400, // average profit or loss per copier
    totalFees: 2000, // fees earned
  };

  const performanceData = [
    { name: 'Jan', copiers: 40, pnl: 2400 },
    { name: 'Feb', copiers: 50, pnl: 1398 },
    { name: 'Mar', copiers: 60, pnl: 9800 },
    { name: 'Apr', copiers: 70, pnl: 3908 },
    { name: 'May', copiers: 80, pnl: 4800 },
    { name: 'Jun', copiers: 90, pnl: 3800 },
  ];

  const assetData = [
    { name: 'Stocks', value: 400 },
    { name: 'Bonds', value: 300 },
    { name: 'Real Estate', value: 300 },
    { name: 'Commodities', value: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const tradeData = [
    { name: 'Jan', wins: 11, losses: 5 },
    { name: 'Feb', wins: 8, losses: 7 },
    { name: 'Mar', wins: 15, losses: 3 },
    { name: 'Apr', wins: 12, losses: 6 },
    { name: 'May', wins: 9, losses: 4 },
    { name: 'Jun', wins: 13, losses: 5 },
  ];

  return (
    <>
      <div className="copier-overview-container">
        <div className="copier-overview-card">
          <h3>Total Copiers</h3>
          <p>{metrics.totalCopiers}</p>
        </div>

        <div className="copier-overview-card">
          <h3>Total Capital Allocated</h3>
          <p>${metrics.totalCapital.toLocaleString()}</p>
        </div>

        <div className="copier-overview-card">
          <h3>Win Rate (%)</h3>
          <p>{metrics.winRate}%</p>
        </div>

        <div className="copier-overview-card">
          <h3>Total Profit/Loss (P&L) of Copiers</h3>
          <p>${metrics.totalPnL.toLocaleString()}</p>
          <h4>Average Copier P&L</h4>
          <p>${metrics.avgPnL.toLocaleString()}</p>
        </div>

        <div className="copier-overview-card">
          <h3>Total Fees Earned</h3>
          <p>${metrics.totalFees.toLocaleString()}</p>
        </div>
      </div>
      <div className="charts-section">
        <div className="chart-card">
          <h3>Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="copiers" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="pnl" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {assetData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Win/Loss Trade History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="wins" fill="#82ca9d" />
              <Bar dataKey="losses" fill="#ff7f7f" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default CopierOverviewContent;
