import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Wallet, User, FileText, CheckCircle, Users } from 'lucide-react'

interface BottomNavProps {
  role: 'investor' | 'umkm' | 'auditor'
}

export default function BottomNav({ role }: BottomNavProps) {
  const location = useLocation()

  const investorNav = [
    { path: '/investor/dashboard', icon: Home, label: 'Home' },
    { path: '/investor/marketplace', icon: Search, label: 'Market' },
    { path: '/investor/portfolio', icon: Wallet, label: 'Portfolio' },
    { path: '/investor/profile', icon: User, label: 'Profile' },
  ]

  const umkmNav = [
    { path: '/umkm/dashboard', icon: Home, label: 'Home' },
    { path: '/umkm/reports', icon: FileText, label: 'Reports' },
    { path: '/umkm/investors', icon: Users, label: 'Investors' },
    { path: '/umkm/profile', icon: User, label: 'Profile' },
  ]

  const auditorNav = [
    { path: '/auditor/dashboard', icon: Home, label: 'Home' },
    { path: '/auditor/approved', icon: CheckCircle, label: 'Approved' },
    { path: '/auditor/profile', icon: User, label: 'Profile' },
  ]

  const navItems = role === 'investor' ? investorNav : role === 'umkm' ? umkmNav : auditorNav

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon className={`h-6 w-6 mb-1 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
