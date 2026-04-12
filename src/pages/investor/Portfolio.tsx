import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

const portfolioData = [
  { id: 1, name: 'Warung Makan Sederhana', shares: 100, buyPrice: 45000, currentPrice: 50000, change: 11.1, category: 'F&B' },
  { id: 2, name: 'Toko Kelontong Jaya', shares: 200, buyPrice: 23000, currentPrice: 25000, change: 8.7, category: 'Retail' },
  { id: 3, name: 'Konveksi Berkah', shares: 50, buyPrice: 80000, currentPrice: 75000, change: -6.25, category: 'Fashion' },
  { id: 4, name: 'Bengkel Motor Sejahtera', shares: 75, buyPrice: 90000, currentPrice: 100000, change: 11.1, category: 'Service' },
  { id: 5, name: 'Laundry Express', shares: 150, buyPrice: 32000, currentPrice: 35000, change: 9.4, category: 'Service' },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export default function PortfolioPage() {
  const totalValue = portfolioData.reduce((sum, item) => sum + (item.shares * item.currentPrice), 0)
  const totalCost = portfolioData.reduce((sum, item) => sum + (item.shares * item.buyPrice), 0)
  const totalGain = totalValue - totalCost
  const totalGainPercent = ((totalGain / totalCost) * 100).toFixed(2)

  const pieData = portfolioData.map(item => ({
    name: item.name,
    value: item.shares * item.currentPrice,
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
                <h2 className="text-3xl font-bold">Rp {(totalValue / 1000000).toFixed(1)}jt</h2>
              </div>
              <Button size="icon" variant="ghost" className="text-white">
                <Eye className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-blue-100 text-xs mb-1">Modal</p>
                <p className="font-semibold">Rp {(totalCost / 1000000).toFixed(1)}jt</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Return</p>
                <p className={`font-semibold ${totalGain >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {totalGain >= 0 ? '+' : ''}{totalGainPercent}%
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
                  {totalGain >= 0 ? '+' : ''}Rp {(totalGain / 1000000).toFixed(2)}jt
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
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `Rp ${(value / 1000000).toFixed(1)}jt`}
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

        {/* Holdings List */}
        <div>
          <h3 className="font-semibold mb-3">Daftar Investasi</h3>
          <div className="space-y-3">
            {portfolioData.map((item, idx) => {
              const value = item.shares * item.currentPrice
              const cost = item.shares * item.buyPrice
              const gain = value - cost
              return (
                <Card key={item.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div 
                        className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      >
                        {item.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm leading-tight mb-1 truncate">{item.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs h-5">{item.category}</Badge>
                              <span className="text-xs text-gray-500">{item.shares} saham</span>
                            </div>
                          </div>
                          <Badge className={`${
                            item.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          } border-0 flex-shrink-0`}>
                            {item.change >= 0 ? '+' : ''}{item.change}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <div>
                            <p className="text-xs text-gray-500">Nilai</p>
                            <p className="font-bold">Rp {(value / 1000000).toFixed(2)}jt</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Gain/Loss</p>
                            <p className={`font-bold ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {gain >= 0 ? '+' : ''}Rp {(gain / 1000).toFixed(0)}k
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
