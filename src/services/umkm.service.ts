import api from '@/lib/axios'

export interface UmkmBusiness {
  id: number
  name: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  pricePerShare: number
  totalShares: number
  sharesOffered: number
  sharesPercentage: number
  annualRevenue: number
  netProfit: number
  totalAssets: number
  employees: number
  address: string
  description: string
  rating: number
  ratingCount: number
  createdAt: string
}

export interface UmkmStats {
  totalInvestors: number
  totalTransactions: number
  marketCap: number
  priceChange: number
}

export interface PriceHistory {
  month: string
  price: number
}

export interface DashboardData {
  hasBusiness: boolean
  business: UmkmBusiness | null
  stats?: UmkmStats
  priceHistory?: PriceHistory[]
}

export interface Investor {
  id: number
  name: string
  email: string
  shares: number
  averagePrice: number
  totalInvestment: number
  percentage: string
  joinedAt: string
}

export interface BusinessDocument {
  id: number
  name: string
  type: string
  file: string
  uploadedAt: string
}

export interface BusinessDividend {
  dividendPercentage: number
  totalDividend: number
  dividendPerShare: number
  period: string
  paidAt: string | null
}

export interface BusinessDetail {
  id: number
  name: string
  category: string
  description: string
  address: string
  status: string
  annualRevenue: number
  netProfit: number
  totalAssets: number
  employees: number
  pricePerShare: number
  totalShares: number
  sharesOffered: number
  sharesPercentage: number
  rating: number
  ratingCount: number
  documents: {
    businessLicense: string | null
    financialReport: string | null
    taxReport: string | null
    ownerIdCard: string | null
  }
  dividend: BusinessDividend | null
  createdAt: string
}

export interface UpdateBusinessData {
  description?: string
  address?: string
  annualRevenue?: number
  netProfit?: number
  totalAssets?: number
  employees?: number
}

export interface FinancialReport {
  id: number
  period: string
  revenue: number
  expenses: number
  netProfit: number
  notes: string | null
  status: 'pending' | 'approved' | 'rejected'
  hasFile: boolean
  createdAt: string
  reviewNotes: string | null
  reviewedAt: string | null
}

export interface UploadReportData {
  period: string
  revenue: number
  expenses: number
  netProfit: number
  notes?: string
}

class UmkmService {
  /**
   * Get UMKM dashboard data
   */
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<{ data: DashboardData }>('/umkm/dashboard')
    return response.data.data
  }

  /**
   * Get business detail
   */
  async getBusinessDetail(): Promise<BusinessDetail> {
    const response = await api.get<{ data: BusinessDetail }>('/umkm/business')
    return response.data.data
  }

  /**
   * Update business information
   */
  async updateBusiness(data: UpdateBusinessData): Promise<BusinessDetail> {
    const response = await api.put<{ data: BusinessDetail }>('/umkm/business', data)
    return response.data.data
  }

  /**
   * Get investors list
   */
  async getInvestors(): Promise<Investor[]> {
    const response = await api.get<{ data: Investor[] }>('/umkm/investors')
    return response.data.data
  }

  /**
   * Get financial reports
   */
  async getFinancialReports(): Promise<FinancialReport[]> {
    const response = await api.get<{ data: FinancialReport[] }>('/umkm/reports')
    return response.data.data
  }

  /**
   * Upload financial report
   */
  async uploadFinancialReport(data: UploadReportData, file?: File): Promise<FinancialReport> {
    const formData = new FormData()
    
    formData.append('period', data.period)
    formData.append('revenue', data.revenue.toString())
    formData.append('expenses', data.expenses.toString())
    formData.append('netProfit', data.netProfit.toString())
    
    if (data.notes) {
      formData.append('notes', data.notes)
    }
    
    if (file) {
      formData.append('reportFile', file)
    }
    
    const response = await api.post<{ data: FinancialReport }>('/umkm/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  }

  /**
   * Download financial report
   */
  async downloadFinancialReport(reportId: number): Promise<{ file: string; mime: string; period: string }> {
    const response = await api.get<{ data: { file: string; mime: string; period: string } }>(`/umkm/reports/${reportId}/download`)
    return response.data.data
  }

  /**
   * Pay dividend to investors
   */
  async payDividend(data: PayDividendRequest): Promise<PayDividendResponse> {
    const response = await api.post<{ data: PayDividendResponse }>('/umkm/dividend', data)
    return response.data.data
  }

  /**
   * Get dividend history
   */
  async getDividendHistory(): Promise<DividendHistory[]> {
    const response = await api.get<{ data: DividendHistory[] }>('/umkm/dividend/history')
    return response.data.data
  }
}

export default new UmkmService()

export interface PayDividendRequest {
  period: string
  netProfit: number
  dividendPercentage: number
  notes?: string
}

export interface PayDividendResponse {
  dividendId: number
  totalDividend: number
  dividendPerShare: number
  investorsCount: number
}

export interface DividendHistory {
  id: number
  period: string
  netProfit: number
  dividendPercentage: number
  totalDividend: number
  dividendPerShare: number
  status: string
  distributedAt: string
  notes: string | null
}
