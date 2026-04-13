import api from '@/lib/axios'

export interface TransactionItem {
  id: number
  businessId: number
  businessName: string
  category: string
  type: 'buy' | 'sell'
  price: number
  quantity: number
  totalAmount: number
  counterparty: string
  createdAt: string
}

export interface TransactionDetail {
  id: number
  business: {
    id: number
    name: string
    category: string
    address: string
  }
  type: 'buy' | 'sell'
  price: number
  quantity: number
  totalAmount: number
  buyer: {
    id: number
    name: string
    email: string
  }
  seller: {
    id: number
    name: string
    email: string
  }
  buyOrder: {
    id: number
    price: number
    quantity: number
  }
  sellOrder: {
    id: number
    price: number
    quantity: number
  }
  createdAt: string
}

export interface TransactionResponse {
  data: TransactionItem[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

class TransactionService {
  /**
   * Get transaction history
   */
  async getTransactions(page: number = 1, limit: number = 20): Promise<TransactionResponse> {
    const response = await api.get<TransactionResponse>('/transactions', {
      params: { page, limit },
    })
    return response.data
  }

  /**
   * Get transaction detail
   */
  async getTransactionDetail(id: number): Promise<TransactionDetail> {
    const response = await api.get<{ data: TransactionDetail }>(`/transactions/${id}`)
    return response.data.data
  }
}

export default new TransactionService()
