import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Wallet, Eye, ArrowUpRight, ArrowRight, Star } from 'lucide-react'

const portfolioHistory = [
  { month: 'Okt', value: 95000000 },
  { month: 'Nov', value: 102000000 },
  { month: 'Des', value: 108000000 },
  { month: 'Jan', value: 115000000 },
  { month: 'Feb', value: 118000000 },
  { month: 'Mar', value: 122000000 },
  { month: 'Apr', value: 125000000 },
]

const topHoldings = [
  { name: 'Warung Makan Sederhana', value: 5000000, change: 8.2 },
  { name: 'Bengkel Motor Sejahtera', value: 7500000, change: 12.3 },
  { name: 'Toko Kelontong Jaya', value: 5000000, change: 5.5 },
]

export default function InvestorDashboard() {
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
                <h2 className="text-3xl font-bold">Rp 125jt</h2>
              </div>
              <Button size="icon" variant="ghost" className="text-white">
                <Eye className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-white/20 text-white border-0">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </Badge>
              <span className="text-blue-100">dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-gray-500 mb-1">Investasi</p>
              <p className="text-2xl font-bold mb-1">8</p>
              <p className="text-xs text-gray-600">UMKM Aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-gray-500 mb-1">Return</p>
              <p className="text-2xl font-bold text-green-600 mb-1">+18.5%</p>
              <p className="text-xs text-gray-600">Per tahun</p>
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
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                <TrendingUp className="h-3 w-3 mr-1" />
                +31.6%
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={portfolioHistory}>
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  style={{ fontSize: '11px' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  formatter={(value) => [`Rp ${(Number(value) / 1000000).toFixed(0)}jt`, 'Nilai']}
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
          <div className="grid grid-cols-2 gap-3">
            <Link to="/investor/marketplace">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5 text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-medium text-sm">Marketplace</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/investor/portfolio">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5 text-center">
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Wallet className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="font-medium text-sm">Portfolio</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Top Holdings */}
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
            {topHoldings.map((item, idx) => (
              <Card key={idx}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm leading-tight mb-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Rp {(item.value / 1000000).toFixed(1)}jt</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={`${
                        item.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      } border-0`}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended */}
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
                  <p className="font-semibold text-sm mb-1">Cafe Kopi Nusantara</p>
                  <p className="text-xs text-gray-600 mb-2">F&B • Return +9.5%</p>
                  <Link to="/investor/orderbook/7">
                    <Button size="sm" className="h-8 text-xs">
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
