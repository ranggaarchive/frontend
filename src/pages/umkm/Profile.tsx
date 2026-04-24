import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Mail, Phone, MapPin, Shield, Bell, HelpCircle, LogOut, ChevronRight, CheckCircle, Loader2, AlertCircle, Wallet } from 'lucide-react'
import umkmService, { type DashboardData } from '@/services/umkm.service'
import authService from '@/services/auth.service'
import { toast } from 'sonner'

export default function UmkmProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const user = authService.getStoredUser()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await umkmService.getDashboard()
      setDashboardData(data)
    } catch (error: any) {
      console.error('Failed to load profile data:', error)
      toast.error('Gagal memuat data profil')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      toast.success('Berhasil logout')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Gagal logout')
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      fb: 'F&B',
      retail: 'Retail',
      fashion: 'Fashion',
      service: 'Service',
      manufacture: 'Manufacture',
    }
    return labels[category] || category
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified & Listed
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-0">
            Pending Review
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700 border-0">
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Profile" />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  if (!dashboardData?.hasBusiness || !dashboardData.business) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Profile" />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-700 font-medium mb-2">Data usaha tidak ditemukan</p>
          <p className="text-sm text-gray-500 text-center mb-4">
            Silakan lengkapi data usaha Anda terlebih dahulu
          </p>
          <Button onClick={() => navigate('/umkm/dashboard')}>Kembali ke Dashboard</Button>
        </div>
      </Layout>
    )
  }

  const { business, stats } = dashboardData

  return (
    <Layout role="umkm">
      <MobileHeader title="Profile" />
      
      <div className="px-4 py-4 space-y-4">
        {/* Business Info */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                <Building2 className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{business.name}</h3>
                {getStatusBadge(business.status)}
                <p className="text-sm text-gray-600 mt-2">
                  {getCategoryLabel(business.category)} • Member sejak {business.createdAt}
                </p>
              </div>
            </div>
            
            {business.status === 'approved' ? (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200 mb-4">
                <p className="text-xs text-green-800">
                  ✓ Usaha Anda sudah terverifikasi dan aktif di platform. Investor dapat melihat dan membeli saham Anda.
                </p>
              </div>
            ) : business.status === 'pending' ? (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                <p className="text-xs text-yellow-800">
                  ⏳ Usaha Anda sedang dalam proses review oleh auditor. Mohon tunggu konfirmasi.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
                <p className="text-xs text-red-800">
                  ✗ Usaha Anda ditolak. Silakan hubungi admin untuk informasi lebih lanjut.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">{stats?.totalInvestors || 0}</p>
                <p className="text-xs text-gray-600">Investor</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-600">
                  Rp {(business.pricePerShare / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-gray-600">Harga Saham</p>
              </div>
              <div className="text-center">
                <p className={`text-xl font-bold ${stats && stats.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats?.priceChange ? (stats.priceChange >= 0 ? '+' : '') + stats.priceChange.toFixed(1) : '0.0'}%
                </p>
                <p className="text-xs text-gray-600">Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <div>
          <h3 className="font-semibold mb-3 px-1">Informasi Akun</h3>
          <Card>
            <CardContent className="pt-3 pb-3 divide-y">
              <Link to="/umkm/balance" className="flex items-center gap-3 py-3">
                <Wallet className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Saldo</p>
                  <p className="font-medium">Rp {user?.balance ? Number(user.balance).toLocaleString('id-ID') : '0'}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              <div className="flex items-center gap-3 py-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{user?.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Telepon</p>
                  <p className="font-medium">{user?.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Alamat</p>
                  <p className="font-medium">{business.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Info */}
        <div>
          <h3 className="font-semibold mb-3 px-1">Informasi Keuangan</h3>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Omzet Tahunan</p>
                  <p className="text-lg font-bold">Rp {(business.annualRevenue / 1000000).toFixed(0)}jt</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Laba Bersih</p>
                  <p className="text-lg font-bold text-green-600">Rp {(business.netProfit / 1000000).toFixed(0)}jt</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Aset</p>
                  <p className="text-lg font-bold">Rp {(business.totalAssets / 1000000).toFixed(0)}jt</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Karyawan</p>
                  <p className="text-lg font-bold">{business.employees} Orang</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Info */}
        <div>
          <h3 className="font-semibold mb-3 px-1">Informasi Saham</h3>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Saham</p>
                  <p className="text-lg font-bold">{business.totalShares.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Saham Ditawarkan</p>
                  <p className="text-lg font-bold">{business.sharesPercentage}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Market Cap</p>
                  <p className="text-lg font-bold">
                    Rp {((business.pricePerShare * business.totalShares) / 1000000).toFixed(0)}jt
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Rating</p>
                  <p className="text-lg font-bold">
                    {business.rating ? Number(business.rating).toFixed(1) : '0.0'} ⭐
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div>
          <h3 className="font-semibold mb-3 px-1">Pengaturan</h3>
          <Card>
            <CardContent className="pt-2 pb-2 divide-y">
              <button className="flex items-center gap-3 py-4 w-full">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="flex-1 text-left font-medium">Keamanan</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button className="flex items-center gap-3 py-4 w-full">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="flex-1 text-left font-medium">Notifikasi</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button className="flex items-center gap-3 py-4 w-full">
                <HelpCircle className="h-5 w-5 text-gray-400" />
                <span className="flex-1 text-left font-medium">Bantuan</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Keluar
        </Button>

        <p className="text-center text-xs text-gray-500 py-4">
          Version 1.0.0
        </p>
      </div>
    </Layout>
  )
}
