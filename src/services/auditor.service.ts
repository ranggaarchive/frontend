import api from '@/lib/axios'

export interface AuditorStats {
  pending: number
  approvedThisMonth: number
  rejectedThisMonth: number
  totalReviewed: number
}

export interface PendingBusiness {
  id: number
  name: string
  category: string
  owner: {
    name: string
    email: string
    phone: string
  }
  submittedDate: string
  status: string
}

export interface DashboardData {
  stats: AuditorStats
  pendingBusinesses: PendingBusiness[]
}

export interface BusinessForReview {
  id: number
  name: string
  category: string
  description: string
  address: string
  status: string
  owner: {
    id: number
    name: string
    email: string
    phone: string
  }
  financial: {
    annualRevenue: number
    netProfit: number
    totalAssets: number
    employees: number
  }
  stock: {
    totalShares: number
    pricePerShare: number
    sharesPercentage: number
    sharesOffered: number
  }
  documents: {
    businessLicense: string | null
    financialReport: string | null
    taxReport: string | null
    ownerIdCard: string | null
  }
  reviewNotes: string | null
  reviewedAt: string | null
  createdAt: string
}

export interface ApprovedBusiness {
  id: number
  name: string
  category: string
  owner: {
    name: string
    email: string
  }
  reviewedAt: string
  listedAt: string
}

export interface FinancialReportForReview {
  id: number
  period: string
  businessName: string
  businessCategory: string
  revenue: number
  expenses: number
  netProfit: number
  hasFile: boolean
  submittedDate: string
  status: string
}

export interface ReviewBusinessData {
  action: 'approve' | 'reject'
  notes?: string
}

class AuditorService {
  /**
   * Get auditor dashboard data
   */
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<{ data: DashboardData }>('/auditor/dashboard')
    return response.data.data
  }

  /**
   * Get business detail for review
   */
  async getBusinessForReview(businessId: number): Promise<BusinessForReview> {
    const response = await api.get<{ data: BusinessForReview }>(`/auditor/businesses/${businessId}`)
    return response.data.data
  }

  /**
   * Review business (approve or reject)
   */
  async reviewBusiness(businessId: number, data: ReviewBusinessData): Promise<void> {
    await api.post(`/auditor/businesses/${businessId}/review`, data)
  }

  /**
   * Get approved businesses
   */
  async getApprovedBusinesses(): Promise<ApprovedBusiness[]> {
    const response = await api.get<{ data: ApprovedBusiness[] }>('/auditor/approved')
    return response.data.data
  }

  /**
   * Get financial reports for review
   */
  async getFinancialReportsForReview(): Promise<FinancialReportForReview[]> {
    const response = await api.get<{ data: FinancialReportForReview[] }>('/auditor/financial-reports')
    return response.data.data
  }

  /**
   * Review financial report
   */
  async reviewFinancialReport(reportId: number, data: ReviewBusinessData): Promise<void> {
    await api.post(`/auditor/financial-reports/${reportId}/review`, data)
  }
}

export default new AuditorService()
