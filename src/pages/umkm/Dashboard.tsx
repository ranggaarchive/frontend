import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, CheckCircle, ArrowUpRight, Edit, Clock, AlertCircle, Eye, DollarSign, Loader2, ArrowDownRight } from 'lucide-react'
import umkmService, { type DashboardData } from '@/services/umkm.service'
import { toast } from 'sonner'

export default function UmkmDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const data = await umkmService.getDashboard()
      setDashboardData(data)
    } catch (error: any) {
      console.error('Failed to load dashboard:', error)
      toast.error('Gagal memuat dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Home" showNotification />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  if (!dashboardData?.hasBusiness) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Home" showNotification />
        <div className="px-4 py-4 space-y-4">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-10 w-10 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Belum Ada Usaha</h3>
                  <p className="text-sm text-blue-50 mb-3">
                    Anda belum mendaftarkan usaha. Silakan lengkapi data usaha Anda untuk mulai listing.
                  </p>
                  <Link to="/umkm/listing-form">
                    <Button variant="secondary" size="sm">
                      Daftar Usaha
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  const { business, stats, priceHistory } = dashboardData
  
  if (!business) {
    return null
  }

  // Jika masih pending review
  if (business.status === 'pending') {
    return (
      <Layout role="umkm">
        <MobileHeader title="Home" showNotification />
        
        <div className="px-4 py-4 space-y-4">
          {/* Review Banner */}
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3">
                <Clock className="h-10 w-10 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Sedang Direview</h3>
                  <p className="text-sm text-yellow-50 mb-3">
                    Pengajuan listing usaha Anda sedang ditinjau oleh auditor. Proses review biasanya memakan waktu 2-3 hari kerja.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                    <span>Diajukan {business.createdAt}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Info */}
          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">{business.name}</h2>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-0">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Review
                  </Badge>
                </div>
                <Link to="/umkm/listing-detail">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Lihat
                  </Button>
                </Link>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Kategori</span>
                  <span className="font-medium capitalize">{business.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Omzet Tahunan</span>
                  <span className="font-medium">Rp {(business.annualRevenue / 1000000).toFixed(0)}jt</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Karyawan</span>
                  <span className="font-medium">{business.employees} Orang</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Alamat</span>
                  <span className="font-medium text-right">{business.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4 pb-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Apa yang terjadi selanjutnya?</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Auditor akan meninjau dokumen dan data usaha Anda</li>
                    <li>• Anda akan menerima notifikasi hasil review</li>
                    <li>• Jika disetujui, usaha akan langsung listing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Jika sudah approved (tampilan normal)
  const formatCurrency = (value: number) => {
    return `Rp ${(value / 1000).toFixed(0)}k`
  }

  return (
    <Layout role="umkm">
      <MobileHeader title="Home" showNotification />
      
      <div className="px-4 py-4 space-y-4">
        {/* Business Header */}
        <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">{business.name}</h2>
                <Badge className="bg-white/20 text-white border-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-green-100 text-xs mb-1">Harga Saham</p>
                <p className="text-2xl font-bold">{formatCurrency(business.pricePerShare)}</p>
              </div>
              <div>
                <p className="text-green-100 text-xs mb-1">Perubahan</p>
                <div className="flex items-center gap-1">
                  {stats && stats.priceChange >= 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4" />
                      <p className="text-2xl font-bold">+{stats.priceChange.toFixed(1)}%</p>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4" />
                      <p className="text-2xl font-bold">{stats?.priceChange.toFixed(1)}%</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold mb-1">{stats?.totalInvestors || 0}</p>
              <p className="text-xs text-gray-600">Total Investor</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold mb-1">
                Rp {stats ? (stats.marketCap / 1000000).toFixed(0) : 0}jt
              </p>
              <p className="text-xs text-gray-600">Market Cap</p>
            </CardContent>
          </Card>
        </div>

        {/* Price Chart */}
        {priceHistory && priceHistory.length > 0 && (
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Harga Saham</h3>
                  <p className="text-xs text-gray-500">Beberapa bulan terakhir</p>
                </div>
                {stats && (
                  <Badge variant="secondary" className={`${
                    stats.priceChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  } border-0`}>
                    {stats.priceChange >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {stats.priceChange >= 0 ? '+' : ''}{stats.priceChange.toFixed(1)}%
                  </Badge>
                )}
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={priceHistory}>
                  <XAxis 
                    dataKey="month" 
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
                    stroke={stats && stats.priceChange >= 0 ? '#10b981' : '#ef4444'}
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <Link to="/umkm/investors">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5 text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-medium text-xs">Investor</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/umkm/dividend">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5 text-center">
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="font-medium text-xs">Dividen</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/umkm/listing-detail">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5 text-center">
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Edit className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="font-medium text-xs">Edit Profil</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Listing Status */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Usaha Anda Sudah Listing</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Satu akun hanya dapat memiliki satu usaha yang listing. Fokus pada pengelolaan dan pelaporan usaha Anda.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-xs font-medium">Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-0 text-xs">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-xs font-medium">Tanggal Listing</span>
                    <span className="text-xs text-gray-600">{business.createdAt}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-xs font-medium">Total Investor</span>
                    <span className="text-xs text-gray-600">{stats?.totalInvestors || 0} Investor</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
