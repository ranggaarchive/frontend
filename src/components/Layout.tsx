import BottomNav from './BottomNav'

interface LayoutProps {
  children: React.ReactNode
  role?: 'investor' | 'umkm' | 'auditor'
}

export default function Layout({ children, role }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className={role ? 'pb-16' : ''}>{children}</main>
      {role && <BottomNav role={role} />}
    </div>
  )
}
