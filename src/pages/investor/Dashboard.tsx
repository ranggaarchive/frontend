import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Wallet, ArrowUpRight, ArrowRight, Star, DollarSign, Loader2 } from 'lucide-react'
import investorService, { type DashboardData } from '@/services/investor.service'
import { toast } from 'sonner'

export default function InvestorDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const dashboardData = await investorService.getDashboard()
      setData(dashboardData)
    } catch (error: any) {
      console.error('Failed to load dashboard:', error)
      toast.error('Gagal memuat dashboard')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}jt`
    }
    return `Rp ${(value / 1000).toFixed(0)}rb`
  }

  if (loading) {
    return (
      <Layout role="investor">
        <MobileHeader title="Home" showNotification />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  if (!data) {
    return (
      <Layout role="investor">
        <MobileHeader title="Home" showNotification />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-gray-500">Gagal memuat data</p>
        </div>
      </Layout>
    )
  }
  return (
    <Layout role="investor">
      <MobileHeader title="Home" showNotification />
      
      <div className="px-4 py-4 space-y-4">
        {/* Portfolio Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Portfolio</p>
                <h2 className="text-3xl font-bold">{formatCurrency(data.portfolio.totalValue)}</h2>
              </div>
              <Link to="/investor/deposit">
                <Button size="sm" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Wallet className="h-4 w-4 mr-1" />
                  Deposit
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge className={`${
                data.portfolio.totalGainPercent >= 0 
                  ? 'bg-white/20 text-white' 
                  : 'bg-red-500/20 text-red-100'
              } border-0`}>
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {data.portfolio.totalGainPercent >= 0 ? '+' : ''}{data.portfolio.totalGainPercent.toFixed(1)}%
              </Badge>
              <span className="text-blue-100">total return</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-gray-500 mb-1">Investasi</p>
              <p className="text-2xl font-bold mb-1">{data.stats.totalInvestments}</p>
              <p className="text-xs text-gray-600">UMKM Aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-gray-500 mb-1">Return</p>
              <p className={`text-2xl font-bold mb-1 ${
                data.stats.avgReturn >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.stats.avgReturn >= 0 ? '+' : ''}{data.stats.avgReturn.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600">Rata-rata</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Performance</h3>
                <p className="text-xs text-gray-500">6 bulan terakhir</p>
              </div>
              <Badge variant="secondary" className={`${
                data.portfolio.totalGainPercent >= 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              } border-0`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {data.portfolio.totalGainPercent >= 0 ? '+' : ''}{data.portfolio.totalGainPercent.toFixed(1)}%
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data.portfolioHistory}>
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  style={{ fontSize: '11px' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  formatter={(value) => [`Rp ${(Number(value) / 1000000).toFixed(1)}jt`, 'Nilai']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Link to="/investor/marketplace">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5 text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-medium text-xs">Marketplace</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/investor/portfolio">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5 text-center">
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Wallet className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="font-medium text-xs">Portfolio</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/investor/dividend">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5 text-center">
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="font-medium text-xs">Dividen</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Top Holdings */}
        {data.topHoldings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Top Holdings</h3>
              <Link to="/investor/portfolio">
                <Button variant="ghost" size="sm" className="text-blue-600 h-8">
                  Lihat Semua
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {data.topHoldings.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm leading-tight mb-1">{item.name}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(item.currentValue)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className={`${
                          item.changePercent > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        } border-0`}>
                          {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recommended */}
        {data.recommended && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Rekomendasi</h3>
            </div>
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">{data.recommended.name}</p>
                    <p className="text-xs text-gray-600 mb-2">
                      {data.recommended.category} • Rating {Number(data.recommended.rating).toFixed(1)}
                    </p>
                    <Link to={`/investor/orderbook/${data.recommended.id}`}>
                      <Button size="sm" className="h-8 text-xs">
                        Lihat Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}
