import { useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Phone, Shield, Bell, HelpCircle, LogOut, ChevronRight, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function InvestorProfile() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <Layout role="investor">
      <MobileHeader title="Profile" />
      
      <div className="px-4 py-4 space-y-4">
        {/* User Info */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">John Doe</h3>
                <p className="text-sm text-gray-600">Investor</p>
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
                <Wallet className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Saldo</p>
                  <p className="font-medium">Rp 2.500.000</p>
                </div>
                <Link to="/investor/deposit">
                  <Button size="sm" variant="outline">
                    Deposit
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">john.doe@email.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Telepon</p>
                  <p className="font-medium">+62 812 3456 7890</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="font-medium">15 Januari 2026</p>
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
