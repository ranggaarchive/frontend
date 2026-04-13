import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, TrendingUp, TrendingDown, Star, SlidersHorizontal, Loader2 } from 'lucide-react'
import marketplaceService, { type MarketplaceBusiness, type TopGainer } from '@/services/marketplace.service'
import { toast } from 'sonner'

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [businesses, setBusinesses] = useState<MarketplaceBusiness[]>([])
  const [topGainers, setTopGainers] = useState<TopGainer[]>([])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadBusinesses()
  }, [activeTab, searchQuery])

  const loadData = async () => {
    try {
      setLoading(true)
      const [businessesData, gainersData] = await Promise.all([
        marketplaceService.getBusinesses({ category: activeTab }),
        marketplaceService.getTopGainers(),
      ])
      setBusinesses(businessesData)
      setTopGainers(gainersData)
    } catch (error: any) {
      console.error('Failed to load marketplace:', error)
      toast.error('Gagal memuat marketplace')
    } finally {
      setLoading(false)
    }
  }

  const loadBusinesses = async () => {
    try {
      const data = await marketplaceService.getBusinesses({
        category: activeTab === 'all' ? undefined : activeTab,
        search: searchQuery || undefined,
      })
      setBusinesses(data)
    } catch (error: any) {
      console.error('Failed to load businesses:', error)
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}jt`
    }
    return `Rp ${(value / 1000).toFixed(0)}k`
  }

  if (loading) {
    return (
      <Layout role="investor">
        <MobileHeader title="Marketplace" showNotification />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout role="investor">
      <MobileHeader title="Marketplace" showNotification />
      
      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Cari UMKM..." 
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 flex-shrink-0">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Top Gainers */}
        {topGainers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Top Gainers</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                24h
              </Badge>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {topGainers.map((umkm) => (
                <Link key={umkm.id} to={`/investor/orderbook/${umkm.id}`}>
                  <Card className="w-36 flex-shrink-0 hover:shadow-md transition-shadow">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{Number(umkm.rating).toFixed(1)}</span>
                      </div>
                      <p className="font-semibold text-sm mb-1 leading-tight line-clamp-2">{umkm.name}</p>
                      <p className="text-xs text-gray-500 mb-2 capitalize">{umkm.category}</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-sm font-bold text-green-600">+{umkm.change.toFixed(1)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-5 h-10">
            <TabsTrigger value="all" className="text-xs">Semua</TabsTrigger>
            <TabsTrigger value="fb" className="text-xs">F&B</TabsTrigger>
            <TabsTrigger value="retail" className="text-xs">Retail</TabsTrigger>
            <TabsTrigger value="fashion" className="text-xs">Fashion</TabsTrigger>
            <TabsTrigger value="service" className="text-xs">Service</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4 space-y-3">
            {businesses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada UMKM ditemukan</p>
              </div>
            ) : (
              businesses.map((umkm) => (
                <Link key={umkm.id} to={`/investor/orderbook/${umkm.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {umkm.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm leading-tight mb-1 line-clamp-1">{umkm.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs h-5 capitalize">{umkm.category}</Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium">{Number(umkm.rating).toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-lg font-bold">{formatCurrency(umkm.price)}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t">
                            <div className="flex items-center gap-1">
                              {umkm.change > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              <span className={`text-sm font-semibold ${
                                umkm.change > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {umkm.change > 0 ? '+' : ''}{umkm.change.toFixed(1)}%
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">Vol: {umkm.volume}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
