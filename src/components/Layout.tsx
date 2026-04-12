import BottomNav from './BottomNav'

interface LayoutProps {
  children: React.ReactNode
  role?: 'investor' | 'umkm' | 'auditor'
}

export default function Layout({ children, role }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Container - max width 480px centered on desktop */}
      <div className="max-w-[480px] mx-auto bg-white min-h-screen relative shadow-xl">
        <main className={role ? 'pb-16' : ''}>{children}</main>
        {role && <BottomNav role={role} />}
      </div>
    </div>
  )
}
