import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, TrendingUp, Users, Loader2, AlertCircle } from 'lucide-react'
import umkmService, { type Investor } from '@/services/umkm.service'
import { toast } from 'sonner'

export default function UmkmInvestors() {
  const [loading, setLoading] = useState(true)
  const [investors, setInvestors] = useState<Investor[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadInvestors()
  }, [])

  const loadInvestors = async () => {
    try {
      setLoading(true)
      const data = await umkmService.getInvestors()
      setInvestors(data)
    } catch (error: any) {
      console.error('Failed to load investors:', error)
      toast.error('Gagal memuat daftar investor')
    } finally {
      setLoading(false)
    }
  }

  // Filter investors based on search query
  const filteredInvestors = investors.filter(investor =>
    investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    investor.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalInvestors = investors.length
  const totalShares = investors.reduce((sum, inv) => sum + inv.shares, 0)
  const totalValue = investors.reduce((sum, inv) => sum + inv.totalInvestment, 0)

  if (loading) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Investors" showNotification />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

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
          <Input 
            placeholder="Cari investor..." 
            className="pl-10 h-11" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="all">Semua ({filteredInvestors.length})</TabsTrigger>
            <TabsTrigger value="top">Top Holders</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 space-y-3">
            {filteredInvestors.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-1">
                    {searchQuery ? 'Investor tidak ditemukan' : 'Belum ada investor'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {searchQuery ? 'Coba kata kunci lain' : 'Investor akan muncul setelah ada yang membeli saham'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredInvestors.map((investor) => (
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
                          <span>Bergabung {investor.joinedAt}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm">Rp {(investor.totalInvestment / 1000000).toFixed(1)}jt</p>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0 text-xs mt-1">
                          {investor.percentage}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          <TabsContent value="top" className="mt-4 space-y-3">
            {filteredInvestors.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-1">Belum ada investor</p>
                  <p className="text-sm text-gray-500">
                    Top holders akan muncul setelah ada yang membeli saham
                  </p>
                </CardContent>
              </Card>
            ) : (
              [...filteredInvestors].sort((a, b) => b.shares - a.shares).slice(0, 5).map((investor, idx) => (
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
                        <p className="text-xs text-gray-600">{investor.shares} saham ({investor.percentage}%)</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm">Rp {(investor.totalInvestment / 1000000).toFixed(1)}jt</p>
                        <p className="text-xs text-gray-500">Avg: Rp {investor.averagePrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
