import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { ArrowLeft, Bell, Settings } from 'lucide-react'

interface MobileHeaderProps {
  title: string
  showBack?: boolean
  showNotification?: boolean
  showSettings?: boolean
}

export default function MobileHeader({ 
  title, 
  showBack = false, 
  showNotification = false,
  showSettings = false 
}: MobileHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {showNotification && (
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          )}
          {showSettings && (
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
