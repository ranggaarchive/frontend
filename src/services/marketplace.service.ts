import api from '@/lib/axios'

export interface MarketplaceBusiness {
  id: number
  name: string
  category: string
  price: number
  sharesOffered: number
  totalShares: number
  rating: number
  ratingCount: number
  description: string
  change: number
  volume: number
}

export interface TopGainer {
  id: number
  name: string
  category: string
  price: number
  rating: number
  ratingCount: number
  change: number
}

export interface BusinessDetail {
  id: number
  name: string
  category: string
  description: string
  address: string
  pricePerShare: number
  sharesOffered: number
  totalShares: number
  sharesPercentage: number
  rating: number
  ratingCount: number
  annualRevenue: number
  netProfit: number
  totalAssets: number
  employees: number
  priceChange: number
  owner: {
    id: number
    name: string
  }
  priceHistory: Array<{
    price: number
    date: string
  }>
  recentTransactions: Array<{
    quantity: number
    price: number
    date: string
  }>
  dividend: {
    period: string
    totalDividend: number
    dividendPerShare: number
    dividendPercentage: number
    distributedAt: string
  } | null
  documents: Array<{
    name: string
    file: string
    type: string
  }>
}

export interface MarketplaceFilters {
  category?: string
  search?: string
  sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'name'
}

class MarketplaceService {
  /**
   * Get all businesses in marketplace
   */
  async getBusinesses(filters?: MarketplaceFilters): Promise<MarketplaceBusiness[]> {
    const params = new URLSearchParams()
    
    if (filters?.category) params.append('category', filters.category)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)

    const response = await api.get<{ data: MarketplaceBusiness[] }>(
      `/marketplace?${params.toString()}`
    )
    return response.data.data
  }

  /**
   * Get top gainers
   */
  async getTopGainers(): Promise<TopGainer[]> {
    const response = await api.get<{ data: TopGainer[] }>('/marketplace/top-gainers')
    return response.data.data
  }

  /**
   * Get business detail
   */
  async getBusinessDetail(id: number): Promise<BusinessDetail> {
    const response = await api.get<{ data: BusinessDetail }>(`/marketplace/${id}`)
    return response.data.data
  }
}

export default new MarketplaceService()
