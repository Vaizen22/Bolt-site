import React from 'react';
import { TraderData } from '../types/trader';
import { TrendingUp, TrendingDown, User, ExternalLink } from 'lucide-react';

interface TraderCardProps {
  trader: TraderData;
  rank: number;
}

const TraderCard: React.FC<TraderCardProps> = ({ trader, rank }) => {
  const isPositiveRatio = trader.ratio >= 1;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-800 font-bold text-sm">
            #{rank}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <User size={16} />
              <span>{trader.name}</span>
            </h3>
            {trader.address && (
              <p className="text-sm text-gray-500 font-mono">{trader.address}</p>
            )}
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 ${isPositiveRatio ? 'text-green-600' : 'text-red-600'}`}>
          {isPositiveRatio ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="font-bold text-lg">{trader.ratio.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="font-medium">Buy: {trader.firstNumber}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="font-medium">Sell: {trader.secondNumber}</span>
          </div>
          <div className="text-gray-600">
            = {trader.firstNumber}/{trader.secondNumber} = <span className="font-bold">{trader.ratio.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {trader.additionalInfo && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Trades:</span>
              <span className="font-medium">{trader.additionalInfo.totalTrades}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Win Rate:</span>
              <span className="font-medium">{trader.additionalInfo.winRate}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">P&L:</span>
              <span className={`font-medium ${trader.additionalInfo.pnl?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {trader.additionalInfo.pnl}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Volume:</span>
              <span className="font-medium">{trader.additionalInfo.volume}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraderCard;