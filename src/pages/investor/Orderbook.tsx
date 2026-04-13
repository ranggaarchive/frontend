import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Star, Download, FileText, AlertCircle, DollarSign, Loader2, X } from 'lucide-react'
import marketplaceService, { type BusinessDetail } from '@/services/marketplace.service'
import orderBookService, { type OrderbookData } from '@/services/orderbook.service'
import investorService from '@/services/investor.service'
import { toast } from 'sonner'


export default function OrderbookPage() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [business, setBusiness] = useState<BusinessDetail | null>(null)
  const [orderbook, setOrderbook] = useState<OrderbookData | null>(null)
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [userShares, setUserShares] = useState<number>(0)
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [shares, setShares] = useState('')
  const [price, setPrice] = useState('')
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1W')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null)

  const loadData = useCallback(async () => {
    if (!id) return
    
    try {
      setLoading(true)
      console.log('Loading business detail for ID:', id)
      
      const [businessData, orderbookData] = await Promise.all([
        marketplaceService.getBusinessDetail(Number(id)),
        orderBookService.getOrderbook(Number(id)),
      ])
      
      console.log('Business data:', businessData)
      console.log('Orderbook data:', orderbookData)
      
      setBusiness(businessData)
      setOrderbook(orderbookData)
      setPrice(businessData.pricePerShare.toString())
      
      // Get user's shares for this business
      try {
        const portfolio = await investorService.getPortfolio()
        const userShare = portfolio.find(p => p.businessId === Number(id))
        setUserShares(userShare?.quantity || 0)
      } catch (error) {
        console.log('No shares found for this business')
        setUserShares(0)
      }
      
      // Get user's orders for this business
      try {
        const orders = await orderBookService.getUserOrders(Number(id))
        setUserOrders(orders)
      } catch (error) {
        console.log('No orders found')
        setUserOrders([])
      }
    } catch (error: any) {
      console.error('Failed to load orderbook:', error)
      console.error('Error response:', error.response?.data)
      toast.error(error.response?.data?.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!business || !shares || !price) return

    try {
      setSubmitting(true)
      await orderBookService.createOrder({
        businessId: business.id,
        type: orderType,
        price: Number(price),
        quantity: Number(shares),
      })
      
      toast.success(`Order ${orderType === 'buy' ? 'beli' : 'jual'} berhasil dibuat`)
      setSheetOpen(false)
      setShares('')
      
      // Reload orderbook
      await loadData()
    } catch (error: any) {
      console.error('Failed to create order:', error)
      toast.error(error.response?.data?.message || 'Gagal membuat order')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelOrder = async (orderId: number) => {
    try {
      setCancellingOrderId(orderId)
      await orderBookService.cancelOrder(orderId)
      toast.success('Order berhasil dibatalkan')
      
      // Reload data
      await loadData()
    } catch (error: any) {
      console.error('Failed to cancel order:', error)
      toast.error(error.response?.data?.message || 'Gagal membatalkan order')
    } finally {
      setCancellingOrderId(null)
    }
  }

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`
  }

  if (loading) {
    return (
      <Layout role="investor">
        <MobileHeader title="Loading..." showBack />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-sm text-gray-500">Memuat data...</p>
        </div>
      </Layout>
    )
  }

  if (!business || !orderbook) {
    return (
      <Layout role="investor">
        <MobileHeader title="Error" showBack />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-700 font-medium mb-2">Data tidak ditemukan</p>
          <p className="text-sm text-gray-500 text-center mb-4">
            Terjadi kesalahan saat memuat data. Silakan coba lagi.
          </p>
          <Button onClick={loadData}>Coba Lagi</Button>
        </div>
      </Layout>
    )
  }

  const priceHistory = business.priceHistory.map((ph) => ({
    time: ph.date,
    price: ph.price,
  }))

  const priceChange = business.priceChange
  const priceChangePercent = priceChange.toFixed(2)

  return (
    <Layout role="investor">
      <MobileHeader title={business.name} showBack />
      
      <div className="pb-20">
        {/* Header Info */}
        <div className="px-4 py-4 bg-white border-b">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs capitalize">{business.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{Number(business.rating).toFixed(1)}</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold">{formatCurrency(business.pricePerShare)}</h2>
            </div>
            <Badge className={`${
              priceChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            } border-0 text-base px-3 py-1`}>
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {priceChange >= 0 ? '+' : ''}{priceChangePercent}%
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Saham Tersedia</p>
              <p className="font-semibold">{business.sharesOffered}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Total Saham</p>
              <p className="font-semibold">{business.totalShares}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Persentase</p>
              <p className="font-semibold">{business.sharesPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 py-4 bg-white">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={priceHistory}>
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <Tooltip 
                formatter={(value) => [`Rp ${Number(value).toLocaleString()}`, 'Harga']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={priceChange >= 0 ? '#16a34a' : '#dc2626'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orderbook */}
        <div className="px-4 py-4 space-y-4">
          <Tabs defaultValue="info">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="orderbook">Orderbook</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="mt-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="grid grid-cols-3 gap-3 text-center text-sm mb-4">
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">High</p>
                      <p className="font-semibold">52k</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Low</p>
                      <p className="font-semibold">47.5k</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Volume</p>
                      <p className="font-semibold">1.250</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orderbook" className="mt-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Buy Orders */}
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <h3 className="text-sm font-semibold text-green-600 mb-3">Buy</h3>
                    {orderbook.buyOrders.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">Tidak ada order</p>
                    ) : (
                      <div className="space-y-2">
                        {orderbook.buyOrders.map((order, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="font-medium text-green-600">
                              {formatCurrency(order.price)}
                            </span>
                            <span className="text-gray-600">{order.volume}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Sell Orders */}
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <h3 className="text-sm font-semibold text-red-600 mb-3">Sell</h3>
                    {orderbook.sellOrders.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">Tidak ada order</p>
                    ) : (
                      <div className="space-y-2">
                        {orderbook.sellOrders.map((order, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="font-medium text-red-600">
                              {formatCurrency(order.price)}
                            </span>
                            <span className="text-gray-600">{order.volume}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* My Orders */}
              {userOrders.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-3">Order Saya</h3>
                  <div className="space-y-2">
                    {userOrders.map((order) => (
                      <Card key={order.id} className="bg-gray-50">
                        <CardContent className="pt-3 pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={order.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}>
                                {order.type === 'buy' ? 'BUY' : 'SELL'}
                              </Badge>
                              <span className="text-sm font-medium">
                                {order.quantity} @ {formatCurrency(order.price)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="secondary"
                                className={
                                  order.status === 'filled' ? 'bg-green-100 text-green-700' :
                                  order.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                                  order.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                                  'bg-blue-100 text-blue-700'
                                }
                              >
                                {order.status === 'filled' ? 'Filled' :
                                 order.status === 'partial' ? 'Partial' :
                                 order.status === 'cancelled' ? 'Cancelled' :
                                 'Pending'}
                              </Badge>
                              {(order.status === 'pending' || order.status === 'partial') && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleCancelOrder(order.id)}
                                  disabled={cancellingOrderId === order.id}
                                >
                                  {cancellingOrderId === order.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <X className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>
                              Terisi: {order.filledQuantity}/{order.quantity}
                            </span>
                            <span>{order.createdAt}</span>
                          </div>
                          {order.status === 'partial' && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full" 
                                  style={{ width: `${(order.filledQuantity / order.quantity) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="info" className="mt-4 space-y-4">
              {/* Business Info */}
              <Card>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-semibold mb-4">Tentang Usaha</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {business.description}
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Kategori</span>
                      <span className="font-medium capitalize">{business.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Alamat</span>
                      <span className="font-medium text-right">{business.address}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Pemilik</span>
                      <span className="font-medium">{business.owner.name}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Karyawan</span>
                      <span className="font-medium">{business.employees} Orang</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Info */}
              <Card>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-semibold mb-4">Informasi Keuangan</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Omzet Tahunan</p>
                      <p className="text-lg font-bold">{formatCurrency(business.annualRevenue)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Laba Bersih</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(business.netProfit)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Total Aset</p>
                      <p className="text-lg font-bold">{formatCurrency(business.totalAssets)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Margin Laba</p>
                      <p className="text-lg font-bold text-blue-600">
                        {((business.netProfit / business.annualRevenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Info */}
              <Card>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-semibold mb-4">Informasi Saham</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Total Saham</span>
                      <span className="font-medium">{business.totalShares.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Saham Ditawarkan</span>
                      <span className="font-medium">{business.sharesOffered.toLocaleString()} ({business.sharesPercentage}%)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Harga per Saham</span>
                      <span className="font-medium">{formatCurrency(business.pricePerShare)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Market Cap</span>
                      <span className="font-medium">{formatCurrency(business.pricePerShare * business.totalShares)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dividend Info */}
              {business.dividend && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Dividen</h3>
                        <p className="text-xs text-gray-600">Pembagian keuntungan untuk investor</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Persentase Dividen</span>
                          <span className="text-2xl font-bold text-green-600">
                            {business.dividend.dividendPercentage}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {business.dividend.dividendPercentage}% dari laba bersih dibagikan sebagai dividen kepada pemegang saham
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Dividen Terakhir</p>
                          <p className="font-bold text-green-600">{formatCurrency(business.dividend.totalDividend)}</p>
                          <p className="text-xs text-gray-400">{business.dividend.period}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Per Saham</p>
                          <p className="font-bold text-green-600">{formatCurrency(business.dividend.dividendPerShare)}</p>
                          <p className="text-xs text-gray-400">{business.dividend.period}</p>
                        </div>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg">
                        <p className="text-xs font-semibold text-green-800 mb-1">Estimasi Dividen Anda</p>
                        <p className="text-sm text-green-700">
                          Jika Anda memiliki 100 saham, estimasi dividen per periode: <span className="font-bold">{formatCurrency(business.dividend.dividendPerShare * 100)}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              {business.documents.length > 0 && (
                <Card>
                  <CardContent className="pt-5 pb-5">
                    <h3 className="font-semibold mb-4">Dokumen & Laporan</h3>
                    <p className="text-xs text-gray-600 mb-4">
                      Download dokumen untuk analisa investasi Anda
                    </p>
                    <div className="space-y-3">
                      {business.documents.map((doc, idx) => (
                        <Card key={idx} className="bg-gray-50 border-gray-200">
                          <CardContent className="pt-3 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{doc.name}</p>
                                <p className="text-xs text-gray-500">PDF Document</p>
                              </div>
                              <a
                                href={`${import.meta.env.VITE_API_URL}/${doc.file}`}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="ghost" size="sm" className="flex-shrink-0">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-yellow-800">
                      <p className="font-semibold mb-1">Disclaimer</p>
                      <p>Dokumen ini disediakan untuk keperluan analisa investasi. Pastikan Anda membaca dan memahami semua informasi sebelum berinvestasi.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t p-4 z-40">
        <Button 
          className="w-full h-12 text-base font-semibold"
          onClick={() => setSheetOpen(true)}
        >
          Trade Sekarang
        </Button>
      </div>

      {/* Trade Sheet Modal */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setSheetOpen(false)}
          />
          
          {/* Sheet Content */}
          <div className="relative w-full max-w-[480px] bg-white rounded-t-3xl shadow-xl animate-in slide-in-from-bottom duration-300">
            <div className="p-6 pb-32 max-h-[85vh] overflow-y-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Buat Order</h2>
                  <button
                    onClick={() => setSheetOpen(false)}
                    className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  >
                    <span className="text-2xl text-gray-400">&times;</span>
                  </button>
                </div>
                <p className="text-sm text-gray-600">{business.name}</p>
              </div>

              {/* Tabs */}
              <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'buy' | 'sell')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="buy">Beli</TabsTrigger>
                  <TabsTrigger value="sell">Jual</TabsTrigger>
                </TabsList>
                
                {/* User Shares Info for Sell */}
                {orderType === 'sell' && (
                  <Card className="mb-4 bg-blue-50 border-blue-200">
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Kepemilikan Anda</span>
                        <span className="text-lg font-bold text-blue-600">{userShares} saham</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <TabsContent value={orderType}>
                  <form onSubmit={handleSubmitOrder} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-base">Harga per Saham</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder={business.pricePerShare.toString()}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="h-12 text-base"
                      />
                      <p className="text-xs text-gray-500">Harga saat ini: Rp {business.pricePerShare.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="shares" className="text-base">Jumlah Saham</Label>
                        {orderType === 'sell' && userShares > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-blue-600"
                            onClick={() => setShares(userShares.toString())}
                          >
                            Jual Semua
                          </Button>
                        )}
                      </div>
                      <Input
                        id="shares"
                        type="number"
                        placeholder="100"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        required
                        max={orderType === 'sell' ? userShares : undefined}
                        className="h-12 text-base"
                      />
                      {orderType === 'sell' && userShares > 0 && (
                        <p className="text-xs text-gray-500">Maksimal: {userShares} saham</p>
                      )}
                    </div>
                    {price && shares && (
                      <Card className="bg-gray-50 border-0 mb-4">
                        <CardContent className="pt-4 pb-4">
                          <p className="text-sm text-gray-600 mb-1">Total</p>
                          <p className="text-2xl font-bold">
                            Rp {(parseInt(price) * parseInt(shares)).toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </form>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Fixed Bottom Button */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-20 bg-white border-t">
              <Button 
                onClick={handleSubmitOrder}
                className="w-full h-12 text-base font-semibold"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  orderType === 'buy' ? 'Beli Saham' : 'Jual Saham'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
                      
    </Layout>
  )
}
