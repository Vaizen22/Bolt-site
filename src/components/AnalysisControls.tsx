import React from 'react';
import { FilterCriteria, AnalysisConfig } from '../types/solana';
import { Settings, Filter, Download, RefreshCw } from 'lucide-react';

interface AnalysisControlsProps {
  criteria: FilterCriteria;
  config: AnalysisConfig;
  onCriteriaChange: (criteria: FilterCriteria) => void;
  onConfigChange: (config: AnalysisConfig) => void;
  onAnalyze: () => void;
  onExport: (format: 'csv' | 'json') => void;
  isLoading: boolean;
}

const AnalysisControls: React.FC<AnalysisControlsProps> = ({
  criteria,
  config,
  onCriteriaChange,
  onConfigChange,
  onAnalyze,
  onExport,
  isLoading
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="text-indigo-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Analysis Configuration</h2>
      </div>

      {/* Filter Criteria */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="text-gray-600" size={18} />
          <h3 className="text-lg font-medium text-gray-800">Filter Criteria</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Tokens Traded
            </label>
            <input
              type="number"
              value={criteria.minTokensTraded}
              onChange={(e) => onCriteriaChange({
                ...criteria,
                minTokensTraded: parseInt(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
              step="50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Win Rate (%)
            </label>
            <input
              type="number"
              value={criteria.minWinRate}
              onChange={(e) => onCriteriaChange({
                ...criteria,
                minWinRate: parseFloat(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
              max="100"
              step="5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Volume ($)
            </label>
            <input
              type="number"
              value={criteria.minVolume}
              onChange={(e) => onCriteriaChange({
                ...criteria,
                minVolume: parseInt(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
              step="100000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trader Tier
            </label>
            <select
              value={criteria.tier || ''}
              onChange={(e) => onCriteriaChange({
                ...criteria,
                tier: e.target.value as any || undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Tiers</option>
              <option value="whale">Whale</option>
              <option value="shark">Shark</option>
              <option value="dolphin">Dolphin</option>
              <option value="fish">Fish</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analysis Config */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Analysis Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeframe
            </label>
            <select
              value={criteria.timeframe}
              onChange={(e) => onCriteriaChange({
                ...criteria,
                timeframe: e.target.value as any
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={config.sortBy}
              onChange={(e) => onConfigChange({
                ...config,
                sortBy: e.target.value as any
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="winRate">Win Rate</option>
              <option value="pnl">P&L</option>
              <option value="volume">Volume</option>
              <option value="tokensTraded">Tokens Traded</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Results
            </label>
            <input
              type="number"
              value={config.maxTraders}
              onChange={(e) => onConfigChange({
                ...config,
                maxTraders: parseInt(e.target.value) || 10
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min="5"
              max="100"
              step="5"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          <span>{isLoading ? 'Analyzing...' : 'Run Analysis'}</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <Download size={16} className="text-gray-600" />
          <button
            onClick={() => onExport('csv')}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => onExport('json')}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisControls;