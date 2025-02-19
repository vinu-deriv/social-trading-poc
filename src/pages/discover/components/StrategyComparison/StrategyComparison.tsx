import { FC } from 'react';
import type { StrategyComparison as ComparisonType } from '@/types/strategy.types';
import FullscreenModal from '@/components/modal/FullscreenModal/FullscreenModal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import './StrategyComparison.css';

interface Props {
  comparison: ComparisonType;
  isOpen: boolean;
  onClose: () => void;
}

export const StrategyComparison: FC<Props> = ({ comparison, isOpen, onClose }) => {
  return (
    <FullscreenModal isOpen={isOpen} onClose={onClose} title="Strategy Comparison Analysis">
      <div className="strategy-comparison">
        <div className="strategy-comparison__allocation-container">
          <h3>AI Insight And Recommendation Percentage</h3>
          <p className="strategy-comparison__summary">{comparison.overview.summary}</p>
          <div className="strategy-comparison__allocation">
            {Object.entries(comparison.recommendation.allocation).map(([name, percentage]) => (
              <div key={name} className="strategy-comparison__allocation-item">
                <div className="strategy-comparison__allocation-value">{percentage}%</div>
                <div className="strategy-comparison__allocation-label">{name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="strategy-comparison__matrix">
          <h3>Risk Level Analysis</h3>
          <div className="strategy-comparison__matrix-grid">
            <div className="strategy-comparison__matrix-item">
              {(
                Object.entries(comparison.comparisonMatrix.riskLevel) as [
                  string,
                  'low' | 'medium' | 'high',
                ][]
              ).map(([name, value]) => (
                <div key={name} className="strategy-comparison__matrix-value">
                  <span className="strategy-comparison__matrix-value-label">{name}</span>
                  <span className={`strategy-comparison__matrix-value-score ${value}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="strategy-comparison__matrix">
          <h3>Performance Analysis</h3>
          <div className="strategy-comparison__chart">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={Object.entries(comparison.comparisonMatrix.performance).map(
                  ([name, perf]) => ({
                    name: name.split(' ').join('\n'),
                    'Total Return': perf.totalReturn,
                    'Win Rate': perf.winRate,
                    'Avg Profit': perf.averageProfit,
                    originalName: name,
                  })
                )}
                margin={{ top: 40, right: 30, left: 30, bottom: 90 }}
                barGap={2}
                barCategoryGap={20}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  height={60}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  yAxisId="percent"
                  label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                  domain={[-100, 100]}
                  tickFormatter={value => `${value}%`}
                  ticks={[-100, -75, -50, -25, 0, 25, 50, 75, 100]}
                  axisLine={true}
                  scale="linear"
                />
                <ReferenceLine y={0} stroke="#666" yAxisId="percent" />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'Avg Profit') return [`${value}`, 'Average Profit'];
                    return [`${value}%`, name];
                  }}
                  labelFormatter={(label, payload) => payload[0]?.payload.originalName || label}
                />
                <Legend
                  wrapperStyle={{ paddingBottom: '20px' }}
                  layout="horizontal"
                  verticalAlign="top"
                  align="center"
                />
                <Bar
                  yAxisId="percent"
                  dataKey="Total Return"
                  fill="#00D0FF"
                  name="Total Return"
                  radius={[4, 4, 0, 0]}
                  barSize={35}
                />
                <Bar
                  yAxisId="percent"
                  dataKey="Win Rate"
                  fill="#00A3FF"
                  name="Win Rate"
                  radius={[4, 4, 0, 0]}
                  barSize={35}
                />
                <Bar
                  yAxisId="percent"
                  dataKey="Avg Profit"
                  fill="#0077FF"
                  name="Average Profit"
                  radius={[4, 4, 0, 0]}
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </FullscreenModal>
  );
};

export default StrategyComparison;
