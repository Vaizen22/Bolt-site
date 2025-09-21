export interface TraderData {
  id: string;
  name: string;
  address?: string;
  firstNumber: number;  // Green/buy color number
  secondNumber: number; // Red/sell color number
  ratio: number;
  additionalInfo?: {
    totalTrades?: number;
    winRate?: string;
    pnl?: string;
    volume?: string;
  };
}

export interface ScrapingConfig {
  url: string;
  rateLimit: number; // milliseconds between requests
  timeout: number;
  retries: number;
}