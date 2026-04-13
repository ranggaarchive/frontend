import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, Calendar, Building2, Loader2 } from 'lucide-react'
import investorService, { type DividendData } from '@/services/investor.service'
import { toast } from 'sonner'

export default function InvestorDividend() {
  const [loading, setLoading] = useState(true)
  const [dividendData, setDividendData] = useState<DividendData | null>(null)

  useEffect(() => {
    loadDividends()
  }, [])

  const loadDividends = async () => {
    try {
      setLoading(true)
      const data = await investorService.getDividends()
      setDividendData(data)
    } catch (error: any) {
      console.error('Failed to load dividends:', error)
      toast.error('Gagal memuat data dividen')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout role="investor">
        <MobileHeader title="Dividen" showBack />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  if (!dividendData) {
    return (
      <Layout role="investor">
        <MobileHeader title="Dividen" showBack />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-gray-500">Tidak ada data dividen</p>
        </div>
      </Layout>
    )
  }

  const totalDividend = dividendData.total
  const dividendHistory = dividendData.history
  
  // Get unique businesses count
  const uniqueBusinesses = new Set(dividendHistory.map(item => item.businessId)).size

  return (
    <Layout role="investor">
      <MobileHeader title="Dividen" showBack />
      
      <div className="px-4 py-4 space-y-4">
        {/* Total Dividen */}
        <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5" />
              <p className="text-green-100 text-sm">Total Dividen Diterima</p>
            </div>
            <h2 className="text-3xl font-bold mb-4">Rp {totalDividend.toLocaleString('id-ID')}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-green-100 text-xs mb-1">Total Pembayaran</p>
                <p className="text-xl font-bold">{dividendHistory.length}</p>
              </div>
              <div>
                <p className="text-green-100 text-xs mb-1">Dari</p>
                <p className="text-xl font-bold">{uniqueBusinesses} UMKM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4">
              <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold mb-1">{dividendHistory.length}</p>
              <p className="text-xs text-gray-600">Total Pembayaran</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <Building2 className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold mb-1">{uniqueBusinesses}</p>
              <p className="text-xs text-gray-600">UMKM Aktif</p>
            </CardContent>
          </Card>
        </div>

        {/* Dividen Terbaru */}
        <div>
          <h3 className="font-semibold mb-3">Riwayat Dividen</h3>
          {dividendHistory.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-gray-500">Belum ada riwayat dividen</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {dividendHistory.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                        {item.businessName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm leading-tight mb-1 truncate">
                              {item.businessName}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs h-5">
                                {item.period}
                              </Badge>
                              <span className="text-xs text-gray-500">{item.sharesOwned} saham</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-green-600">
                              +Rp {item.amount.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 pt-2 border-t">
                          <Calendar className="h-3 w-3" />
                          <span>{item.receivedAt}</span>
                          <span className="ml-auto">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 border-0 text-xs h-5">
                              Diterima
                            </Badge>
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 pb-4">
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Tentang Dividen</p>
              <ul className="space-y-1 text-xs">
                <li>• Dividen dibagikan sesuai porsi kepemilikan saham Anda</li>
                <li>• Pembayaran otomatis masuk ke saldo akun</li>
                <li>• Frekuensi pembayaran tergantung kebijakan UMKM</li>
                <li>• Dividen dapat langsung digunakan untuk investasi baru</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
