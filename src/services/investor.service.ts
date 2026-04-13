import api from '@/lib/axios'

export interface PortfolioSummary {
  totalValue: number
  totalCost: number
  totalGain: number
  totalGainPercent: number
  balance: number
}

export interface Stats {
  totalInvestments: number
  totalDividends: number
  avgReturn: number
}

export interface Holding {
  id: number
  name: string
  category: string
  quantity: number
  averagePrice: number
  currentPrice: number
  currentValue: number
  cost: number
  gain: number
  changePercent: number
}

export interface PortfolioHistory {
  month: string
  value: number
}

export interface RecommendedBusiness {
  id: number
  name: string
  category: string
  pricePerShare: number
  rating: number
}

export interface DashboardData {
  portfolio: PortfolioSummary
  stats: Stats
  topHoldings: Holding[]
  portfolioHistory: PortfolioHistory[]
  recommended: RecommendedBusiness | null
}

export interface PortfolioItem {
  id: number
  businessId: number
  businessName: string
  category: string
  quantity: number
  averagePrice: number
  currentPrice: number
  totalCost: number
  currentValue: number
  gain: number
  changePercent: number
  rating: number
  ratingCount: number
}

export interface DividendPayment {
  id: number
  businessId: number
  businessName: string
  category: string
  period: string
  sharesOwned: number
  amount: number
  receivedAt: string
}

export interface DividendData {
  total: number
  history: DividendPayment[]
}

export interface UserProfile {
  id: number
  fullName: string
  email: string
  phone: string
  role: string
  balance: number
  isVerified: boolean
  createdAt: string
}

class InvestorService {
  /**
   * Get investor dashboard data
   */
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<{ data: DashboardData }>('/investor/dashboard')
    return response.data.data
  }

  /**
   * Get investor portfolio
   */
  async getPortfolio(): Promise<PortfolioItem[]> {
    const response = await api.get<{ data: PortfolioItem[] }>('/investor/portfolio')
    return response.data.data
  }

  /**
   * Get investor dividends
   */
  async getDividends(): Promise<DividendData> {
    const response = await api.get<{ data: DividendData }>('/investor/dividends')
    return response.data.data
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<{ data: UserProfile }>('/auth/me')
    return response.data.data
  }
}

export default new InvestorService()
