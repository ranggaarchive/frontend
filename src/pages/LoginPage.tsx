import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Layout from '@/components/Layout'
import { Building2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'investor' | 'umkm' | 'auditor' | ''>('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!role) {
      toast.error('Pilih role terlebih dahulu')
      return
    }

    setLoading(true)
    
    try {
      await login({ email, password, role })
      toast.success('Login berhasil!')
    } catch (error: any) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Login gagal. Periksa email dan password Anda.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-12 pb-8 text-white text-center">
          <div className="h-16 w-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Selamat Datang</h1>
          <p className="text-blue-100 text-sm">Masuk untuk melanjutkan</p>
        </div>

        {/* Form */}
        <div className="flex-1 bg-white rounded-t-3xl px-4 py-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={loading}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={loading}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-base">Masuk Sebagai</Label>
              <Select value={role} onValueChange={(value: any) => setRole(value)} required disabled={loading}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="umkm">Pemilik UMKM</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold mt-6" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link to="/register" className="text-blue-600 font-semibold">
                Daftar sekarang
              </Link>
            </p>
          </div>

          {/* Stats */}
          <Card className="mt-8 bg-gray-50 border-0">
            <CardContent className="pt-5 pb-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-blue-600">248+</p>
                  <p className="text-xs text-gray-600">UMKM</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-green-600">15K+</p>
                  <p className="text-xs text-gray-600">Investor</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-purple-600">18.5%</p>
                  <p className="text-xs text-gray-600">Return</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
