import api from '@/lib/axios'

export interface OrderbookOrder {
  price: number
  volume: number
}

export interface OrderbookData {
  buyOrders: OrderbookOrder[]
  sellOrders: OrderbookOrder[]
}

export interface CreateOrderRequest {
  businessId: number
  type: 'buy' | 'sell'
  price: number
  quantity: number
}

export interface UserOrder {
  id: number
  type: 'buy' | 'sell'
  price: number
  quantity: number
  filledQuantity: number
  status: 'pending' | 'partial' | 'filled' | 'cancelled'
  createdAt: string
}

class OrderbookService {
  /**
   * Get orderbook for a business
   */
  async getOrderbook(businessId: number): Promise<OrderbookData> {
    const response = await api.get<{ data: OrderbookData }>(`/orderbook/${businessId}`)
    return response.data.data
  }

  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderRequest): Promise<void> {
    await api.post('/orderbook/order', data)
  }

  /**
   * Get user's orders for a business
   */
  async getUserOrders(businessId: number): Promise<UserOrder[]> {
    const response = await api.get<{ data: UserOrder[] }>(`/orderbook/${businessId}/user-orders`)
    return response.data.data
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: number): Promise<void> {
    await api.delete(`/orderbook/order/${orderId}`)
  }
}

export default new OrderbookService()
