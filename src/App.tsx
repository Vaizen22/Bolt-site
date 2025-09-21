import React, { useState, useCallback } from 'react';
import { BarChart3, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import SolanaAnalyzer from './services/solanaAnalyzer';
import TraderAnalysisCard from './components/TraderAnalysisCard';
import AnalysisControls from './components/AnalysisControls';
import AnalysisSummary from './components/AnalysisSummary';
import { SolanaTrader, FilterCriteria, AnalysisConfig } from './types/solana';

function App() {
  const [traders, setTraders] = useState<SolanaTrader[]>([]);
  const [filteredTraders, setFilteredTraders] = useState<SolanaTrader[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [criteria, setCriteria] = useState<FilterCriteria>({
    minTokensTraded: 500,
    minWinRate: 70,
    minVolume: 1000000,
    timeframe: 'monthly'
  });

  const [config, setConfig] = useState<AnalysisConfig>({
    dataSource: 'demo',
    refreshInterval: 300000,
    maxTraders: 20,
    sortBy: 'winRate',
    sortOrder: 'desc'
  });

  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const analyzer = new SolanaAnalyzer(config);
      
      // Fetch trader data
      const allTraders = await analyzer.fetchTraderData();
      setTraders(allTraders);

      // Apply filters
      const filtered = analyzer.filterTraders(criteria);
      
      // Rank traders
      const ranked = analyzer.rankTraders(filtered, config.sortBy, config.sortOrder);
      const limited = ranked.slice(0, config.maxTraders);
      setFilteredTraders(limited);

      // Generate comprehensive analysis
      const analysisResult = analyzer.generateAnalysis();
      setAnalysis(analysisResult);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  }, [criteria, config]);

  const handleExport = useCallback((format: 'csv' | 'json') => {
    if (filteredTraders.length === 0) return;

    const analyzer = new SolanaAnalyzer(config);
    let data: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      data = analyzer.exportToCSV(filteredTraders);
      filename = 'solana-traders-analysis.csv';
      mimeType = 'text/csv';
    } else {
      data = analyzer.exportToJSON(filteredTraders);
      filename = 'solana-traders-analysis.json';
      mimeType = 'application/json';
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredTraders, config]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="text-indigo-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Solana Trader Analyzer</h1>
                <p className="text-gray-600">Discover and analyze high-performing Solana traders</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield size={16} />
              <span>Ethical Analysis Tool</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Ethical Notice */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6 rounded-r-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Ethical Trading Analysis</h3>
              <p className="text-amber-700 text-sm mb-3">
                This tool demonstrates ethical approaches to trader analysis using publicly available blockchain data. 
                It respects platform terms of service and implements proper rate limiting.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <a 
                  href="https://solscan.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-amber-800 hover:text-amber-900 underline"
                >
                  <ExternalLink size={14} />
                  <span>Solscan API</span>
                </a>
                <a 
                  href="https://docs.solana.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-amber-800 hover:text-amber-900 underline"
                >
                  <ExternalLink size={14} />
                  <span>Solana Documentation</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Controls */}
        <AnalysisControls
          criteria={criteria}
          config={config}
          onCriteriaChange={setCriteria}
          onConfigChange={setConfig}
          onAnalyze={runAnalysis}
          onExport={handleExport}
          isLoading={isLoading}
        />

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-red-600" size={20} />
              <span className="text-red-800 font-medium">Analysis Error: {error}</span>
            </div>
          </div>
        )}

        {/* Analysis Summary */}
        {analysis && <AnalysisSummary analysis={analysis} />}

        {/* Results */}
        {filteredTraders.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Top {filteredTraders.length} Traders
                <span className="text-lg font-normal text-gray-600 ml-2">
                  (Filtered by {criteria.minWinRate}% win rate, {criteria.minTokensTraded}+ tokens)
                </span>
              </h2>
              <div className="text-sm text-gray-500">
                Sorted by {config.sortBy} • {criteria.timeframe} timeframe
              </div>
            </div>

            <div className="grid gap-6">
              {filteredTraders.map((trader, index) => (
                <TraderAnalysisCard
                  key={trader.id}
                  trader={trader}
                  rank={index + 1}
                  timeframe={criteria.timeframe === 'all' ? 'monthly' : criteria.timeframe}
                />
              ))}
            </div>

            {/* Load More / Pagination could go here */}
            {filteredTraders.length >= config.maxTraders && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Showing top {config.maxTraders} results. Adjust filters or increase max results to see more.
                </p>
                <button
                  onClick={() => setConfig({...config, maxTraders: config.maxTraders + 20})}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Load More Traders
                </button>
              </div>
            )}
          </div>
        )}

        {/* Getting Started */}
        {filteredTraders.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Analyze Traders</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Configure your analysis criteria above and click "Run Analysis" to discover high-performing Solana traders.
            </p>
            <button
              onClick={runAnalysis}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Start Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;