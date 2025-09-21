export interface SolanaTrader {
  id: string;
  walletAddress: string;
  username?: string;
  stats: {
    winRate: number;
    tokensTraded: number;
    totalTrades: number;
    pnl: number;
    volume: number;
    avgHoldTime: string;
    successfulTrades: number;
    failedTrades: number;
  };
  timeframePerformance: {
    daily: PerformanceMetrics;
    weekly: PerformanceMetrics;
    monthly: PerformanceMetrics;
  };
  lastActive: string;
  tier: 'whale' | 'shark' | 'dolphin' | 'fish';
}

export interface PerformanceMetrics {
  winRate: number;
  pnl: number;
  volume: number;
  trades: number;
  bestTrade: number;
  worstTrade: number;
  avgTradeSize: number;
}

export interface FilterCriteria {
  minTokensTraded: number;
  minWinRate: number;
  minVolume: number;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all';
  tier?: 'whale' | 'shark' | 'dolphin' | 'fish';
}

export interface AnalysisConfig {
  dataSource: 'demo' | 'api';
  refreshInterval: number;
  maxTraders: number;
  sortBy: 'winRate' | 'volume' | 'pnl' | 'tokensTraded';
  sortOrder: 'asc' | 'desc';
}