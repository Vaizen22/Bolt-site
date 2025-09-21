import React from 'react';
import { SolanaTrader } from '../types/solana';
import { TrendingUp, TrendingDown, Wallet, Trophy, Target, Clock } from 'lucide-react';

interface TraderAnalysisCardProps {
  trader: SolanaTrader;
  rank: number;
  timeframe?: 'daily' | 'weekly' | 'monthly';
}

const TraderAnalysisCard: React.FC<TraderAnalysisCardProps> = ({ trader, rank, timeframe = 'monthly' }) => {
  const performance = trader.timeframePerformance[timeframe];
  const isPositivePnL = trader.stats.pnl > 0;
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'whale': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shark': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dolphin': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-indigo-500 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full text-indigo-800 font-bold">
            #{rank}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {trader.username || 'Anonymous Trader'}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTierColor(trader.tier)}`}>
                {trader.tier.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Wallet size={14} />
              <span className="font-mono">{formatAddress(trader.walletAddress)}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 ${isPositivePnL ? 'text-green-600' : 'text-red-600'}`}>
          {isPositivePnL ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="font-bold text-lg">{trader.stats.winRate.toFixed(1)}%</span>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-indigo-600">
            {trader.stats.tokensTraded.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Tokens Traded</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-600">
            {formatCurrency(trader.stats.pnl)}
          </div>
          <div className="text-xs text-gray-600">Total P&L</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">
            {formatCurrency(trader.stats.volume)}
          </div>
          <div className="text-xs text-gray-600">Volume</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-purple-600">
            {trader.stats.totalTrades.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Total Trades</div>
        </div>
      </div>

      {/* Timeframe Performance */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 capitalize">
          {timeframe} Performance
        </h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Win Rate</div>
            <div className="font-semibold text-green-600">{performance.winRate.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-gray-600">P&L</div>
            <div className={`font-semibold ${performance.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(performance.pnl)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Trades</div>
            <div className="font-semibold text-gray-900">{performance.trades}</div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Clock size={14} />
          <span>Avg Hold: {trader.stats.avgHoldTime}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Target size={14} />
          <span>Success: {trader.stats.successfulTrades}/{trader.stats.totalTrades}</span>
        </div>
        <div className="text-xs">
          Last Active: {new Date(trader.lastActive).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TraderAnalysisCard;