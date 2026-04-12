import { useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Mail, Phone, MapPin, Shield, Bell, HelpCircle, LogOut, ChevronRight, CheckCircle } from 'lucide-react'

export default function UmkmProfile() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

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
                <h3 className="font-semibold text-lg mb-1">Warung Makan Sederhana</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-0 mb-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified & Listed
                </Badge>
                <p className="text-sm text-gray-600">F&B • Member sejak Jan 2026</p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
              <p className="text-xs text-blue-800">
                ℹ️ Satu akun hanya dapat memiliki satu usaha yang listing. Usaha Anda sudah aktif di platform.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">248</p>
                <p className="text-xs text-gray-600">Investor</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-600">Rp 50k</p>
                <p className="text-xs text-gray-600">Harga Saham</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-purple-600">+8.2%</p>
                <p className="text-xs text-gray-600">Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Details */}
        <div>
          <h3 className="font-semibold mb-3 px-1">Informasi Usaha</h3>
          <Card>
            <CardContent className="pt-3 pb-3 divide-y">
              <div className="flex items-center gap-3 py-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">info@warungmakan.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Telepon</p>
                  <p className="font-medium">021-12345678</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Alamat</p>
                  <p className="font-medium">Jl. Raya Bogor No. 123, Jakarta Timur</p>
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
                  <p className="text-lg font-bold">Rp 600jt</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Laba Bersih</p>
                  <p className="text-lg font-bold text-green-600">Rp 120jt</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Aset</p>
                  <p className="text-lg font-bold">Rp 350jt</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Karyawan</p>
                  <p className="text-lg font-bold">12 Orang</p>
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
