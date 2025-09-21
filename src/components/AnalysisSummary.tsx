import React from 'react';
import { SolanaTrader } from '../types/solana';
import { TrendingUp, Users, DollarSign, Target, Award } from 'lucide-react';

interface AnalysisSummaryProps {
  analysis: {
    totalTraders: number;
    whales: SolanaTrader[];
    topDaily: SolanaTrader[];
    topWeekly: SolanaTrader[];
    topMonthly: SolanaTrader[];
    averageStats: {
      winRate: number;
      volume: number;
      tokensTraded: number;
    };
  };
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ analysis }) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="text-green-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Analysis Summary</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2 mx-auto">
            <Users className="text-blue-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{analysis.totalTraders}</div>
          <div className="text-sm text-gray-600">Total Traders</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-2 mx-auto">
            <Award className="text-purple-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-purple-600">{analysis.whales.length}</div>
          <div className="text-sm text-gray-600">Whale Traders</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2 mx-auto">
            <Target className="text-green-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-green-600">{analysis.averageStats.winRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Avg Win Rate</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-2 mx-auto">
            <DollarSign className="text-indigo-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {formatCurrency(analysis.averageStats.volume)}
          </div>
          <div className="text-sm text-gray-600">Avg Volume</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-2 mx-auto">
            <TrendingUp className="text-orange-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(analysis.averageStats.tokensTraded)}
          </div>
          <div className="text-sm text-gray-600">Avg Tokens</div>
        </div>
      </div>

      {/* Top Performers by Timeframe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Top Daily Performers</h3>
          <div className="space-y-2">
            {analysis.topDaily.slice(0, 3).map((trader, index) => (
              <div key={trader.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-blue-900">
                    {trader.username || `${trader.walletAddress.slice(0, 6)}...`}
                  </span>
                </div>
                <span className="text-blue-700 font-semibold">
                  {formatCurrency(trader.timeframePerformance.daily.pnl)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3">Top Weekly Performers</h3>
          <div className="space-y-2">
            {analysis.topWeekly.slice(0, 3).map((trader, index) => (
              <div key={trader.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-green-900">
                    {trader.username || `${trader.walletAddress.slice(0, 6)}...`}
                  </span>
                </div>
                <span className="text-green-700 font-semibold">
                  {formatCurrency(trader.timeframePerformance.weekly.pnl)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">Top Monthly Performers</h3>
          <div className="space-y-2">
            {analysis.topMonthly.slice(0, 3).map((trader, index) => (
              <div key={trader.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-purple-900">
                    {trader.username || `${trader.walletAddress.slice(0, 6)}...`}
                  </span>
                </div>
                <span className="text-purple-700 font-semibold">
                  {formatCurrency(trader.timeframePerformance.monthly.pnl)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Whale Spotlight */}
      {analysis.whales.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-3">🐋 Whale Spotlight</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.whales.slice(0, 2).map((whale) => (
              <div key={whale.id} className="bg-white/10 rounded-lg p-4">
                <div className="font-semibold mb-2">
                  {whale.username || `${whale.walletAddress.slice(0, 8)}...`}
                </div>
                <div className="text-sm space-y-1">
                  <div>Win Rate: <span className="font-semibold">{whale.stats.winRate.toFixed(1)}%</span></div>
                  <div>Volume: <span className="font-semibold">{formatCurrency(whale.stats.volume)}</span></div>
                  <div>Tokens: <span className="font-semibold">{whale.stats.tokensTraded.toLocaleString()}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisSummary;