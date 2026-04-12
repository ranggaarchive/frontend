import { useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, Shield, Bell, HelpCircle, LogOut, ChevronRight, Award } from 'lucide-react'

export default function AuditorProfile() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <Layout role="auditor">
      <MobileHeader title="Profile" />
      
      <div className="px-4 py-4 space-y-4">
        {/* User Info */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                AS
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Ahmad Santoso</h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-0 mb-2">
                  <Award className="h-3 w-3 mr-1" />
                  Auditor
                </Badge>
                <p className="text-sm text-gray-600">Member sejak Jan 2025</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">156</p>
                <p className="text-xs text-gray-600">Total Review</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-600">48</p>
                <p className="text-xs text-gray-600">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-yellow-600">12</p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <div>
          <h3 className="font-semibold mb-3 px-1">Informasi Akun</h3>
          <Card>
            <CardContent className="pt-3 pb-3 divide-y">
              <div className="flex items-center gap-3 py-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">ahmad.santoso@auditor.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Telepon</p>
                  <p className="font-medium">+62 821 9876 5432</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">ID Auditor</p>
                  <p className="font-medium">AUD-2025-001</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance */}
        <div>
          <h3 className="font-semibold mb-3 px-1">Performa Bulan Ini</h3>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Review Selesai</span>
                  <span className="font-semibold">48 UMKM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approval Rate</span>
                  <span className="font-semibold text-green-600">85.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Review Time</span>
                  <span className="font-semibold">2.5 hari</span>
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
