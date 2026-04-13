import api from '@/lib/axios'

export interface CreateDepositRequest {
  amount: number
  paymentMethod: string
}

export interface DepositResponse {
  id: number
  amount: number
  paymentMethod: string
  status: string
  newBalance: number
}

export interface DepositHistory {
  id: number
  amount: number
  paymentMethod: string
  status: string
  createdAt: string
}

class DepositService {
  /**
   * Create a new deposit
   */
  async createDeposit(data: CreateDepositRequest): Promise<DepositResponse> {
    const response = await api.post<{ data: DepositResponse }>('/deposits', data)
    return response.data.data
  }

  /**
   * Get deposit history
   */
  async getHistory(): Promise<DepositHistory[]> {
    const response = await api.get<{ data: DepositHistory[] }>('/deposits')
    return response.data.data
  }
}

export default new DepositService()
