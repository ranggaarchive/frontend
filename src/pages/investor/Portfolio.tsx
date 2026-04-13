import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import investorService, { type PortfolioItem } from '@/services/investor.service'
import { toast } from 'sonner'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [showValues, setShowValues] = useState(true)

  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    try {
      setLoading(true)
      const data = await investorService.getPortfolio()
      setPortfolio(data)
    } catch (error: any) {
      console.error('Failed to load portfolio:', error)
      toast.error('Gagal memuat portfolio')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    if (!showValues) return 'Rp ****'
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}jt`
    }
    return `Rp ${(value / 1000).toFixed(0)}k`
  }

  if (loading) {
    return (
      <Layout role="investor">
        <MobileHeader title="Portfolio" showNotification />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  const totalValue = portfolio.reduce((sum, item) => sum + Number(item.currentValue), 0)
  const totalCost = portfolio.reduce((sum, item) => sum + Number(item.totalCost), 0)
  const totalGain = totalValue - totalCost
  const totalGainPercent = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(2) : '0'

  const pieData = portfolio.map(item => ({
    name: item.businessName,
    value: Number(item.currentValue),
  }))

  return (
    <Layout role="investor">
      <MobileHeader title="Portfolio" showNotification />
      
      <div className="px-4 py-4 space-y-4">
        {/* Total Value Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Nilai</p>
                <h2 className="text-3xl font-bold">
                  {showValues ? `Rp ${(totalValue / 1000000).toFixed(1)}jt` : 'Rp ****'}
                </h2>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white"
                onClick={() => setShowValues(!showValues)}
              >
                <Eye className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-blue-100 text-xs mb-1">Modal</p>
                <p className="font-semibold">
                  {showValues ? `Rp ${(totalCost / 1000000).toFixed(1)}jt` : 'Rp ****'}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Return</p>
                <p className={`font-semibold ${totalGain >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {showValues ? `${totalGain >= 0 ? '+' : ''}${totalGainPercent}%` : '****%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gain/Loss */}
        <Card className={totalGain >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Gain/Loss</p>
                <p className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {showValues 
                    ? `${totalGain >= 0 ? '+' : ''}Rp ${(totalGain / 1000000).toFixed(2)}jt`
                    : 'Rp ****'
                  }
                </p>
              </div>
              {totalGain >= 0 ? (
                <TrendingUp className="h-10 w-10 text-green-600" />
              ) : (
                <TrendingDown className="h-10 w-10 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        {portfolio.length > 0 && (
          <Card>
            <CardContent className="pt-5 pb-4">
              <h3 className="font-semibold mb-4">Alokasi Portfolio</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `Rp ${(Number(value) / 1000000).toFixed(1)}jt`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Holdings List */}
        <div>
          <h3 className="font-semibold mb-3">Daftar Investasi</h3>
          {portfolio.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-gray-500">Belum ada investasi</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {portfolio.map((item, idx) => (
                <Card key={item.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div 
                        className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      >
                        {item.businessName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm leading-tight mb-1 truncate">{item.businessName}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs h-5 capitalize">{item.category}</Badge>
                              <span className="text-xs text-gray-500">{item.quantity} saham</span>
                            </div>
                          </div>
                          <Badge className={`${
                            (item.changePercent || 0) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          } border-0 flex-shrink-0`}>
                            {(item.changePercent || 0) >= 0 ? '+' : ''}{(item.changePercent || 0).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <div>
                            <p className="text-xs text-gray-500">Nilai</p>
                            <p className="font-bold">{formatCurrency(Number(item.currentValue))}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Gain/Loss</p>
                            <p className={`font-bold ${Number(item.gain) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {showValues 
                                ? `${Number(item.gain) >= 0 ? '+' : ''}${formatCurrency(Math.abs(Number(item.gain)))}`
                                : 'Rp ****'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
