import api from '@/lib/axios'

export interface PlatformStats {
  totalBusinesses: number
  totalInvestors: number
  totalInvestment: number
  avgReturn: string
  recentTransactions: number
}

export interface TopBusiness {
  id: number
  name: string
  category: string
  pricePerShare: number
  rating: number
  ratingCount: number
}

export interface StatsResponse {
  data: {
    stats: PlatformStats
    topBusinesses: TopBusiness[]
  }
}

class StatsService {
  /**
   * Get public platform statistics
   */
  async getPublicStats(): Promise<StatsResponse> {
    const response = await api.get<StatsResponse>('/stats')
    return response.data
  }

  /**
   * Get detailed statistics (authenticated users only)
   */
  async getDetailedStats(): Promise<any> {
    const response = await api.get('/stats/detailed')
    return response.data
  }
}

export default new StatsService()
