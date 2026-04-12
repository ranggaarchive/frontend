import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, TrendingUp, Users } from 'lucide-react'

const investors = [
  { id: 1, name: 'John Doe', shares: 150, value: 7500000, joinDate: '15 Jan 2026', change: 11.1 },
  { id: 2, name: 'Jane Smith', shares: 200, value: 10000000, joinDate: '18 Jan 2026', change: 11.1 },
  { id: 3, name: 'Ahmad Yani', shares: 100, value: 5000000, joinDate: '20 Jan 2026', change: 11.1 },
  { id: 4, name: 'Siti Nurhaliza', shares: 180, value: 9000000, joinDate: '22 Jan 2026', change: 11.1 },
  { id: 5, name: 'Budi Santoso', shares: 120, value: 6000000, joinDate: '25 Jan 2026', change: 11.1 },
  { id: 6, name: 'Dewi Lestari', shares: 90, value: 4500000, joinDate: '28 Jan 2026', change: 11.1 },
  { id: 7, name: 'Rudi Hartono', shares: 160, value: 8000000, joinDate: '01 Feb 2026', change: 11.1 },
  { id: 8, name: 'Maya Putri', shares: 140, value: 7000000, joinDate: '05 Feb 2026', change: 11.1 },
]

export default function UmkmInvestors() {
  const totalInvestors = investors.length
  const totalShares = investors.reduce((sum, inv) => sum + inv.shares, 0)
  const totalValue = investors.reduce((sum, inv) => sum + inv.value, 0)

  return (
    <Layout role="umkm">
      <MobileHeader title="Investors" showNotification />
      
      <div className="px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-1 text-blue-600" />
              <p className="text-xl font-bold">{totalInvestors}</p>
              <p className="text-xs text-gray-600">Investor</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-1 text-green-600" />
              <p className="text-xl font-bold">{totalShares}</p>
              <p className="text-xs text-gray-600">Saham Terjual</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-1 text-purple-600" />
              <p className="text-xl font-bold">{(totalValue / 1000000).toFixed(0)}jt</p>
              <p className="text-xs text-gray-600">Total Nilai</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Cari investor..." className="pl-10 h-11" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="all">Semua ({totalInvestors})</TabsTrigger>
            <TabsTrigger value="top">Top Holders</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 space-y-3">
            {investors.map((investor) => (
              <Card key={investor.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {investor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm mb-1">{investor.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>{investor.shares} saham</span>
                        <span>•</span>
                        <span>Bergabung {investor.joinDate}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm">Rp {(investor.value / 1000000).toFixed(1)}jt</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-0 text-xs mt-1">
                        +{investor.change}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="top" className="mt-4 space-y-3">
            {[...investors].sort((a, b) => b.shares - a.shares).slice(0, 5).map((investor, idx) => (
              <Card key={investor.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {investor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm mb-1">{investor.name}</p>
                      <p className="text-xs text-gray-600">{investor.shares} saham</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm">Rp {(investor.value / 1000000).toFixed(1)}jt</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
