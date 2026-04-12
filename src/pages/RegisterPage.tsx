import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Layout from '@/components/Layout'
import { Building2, CheckCircle, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState<string>('')
  const [step, setStep] = useState(1)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (role === 'umkm' && step === 1) {
      setStep(2)
    } else {
      navigate('/login')
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
          <h1 className="text-3xl font-bold mb-2">
            {role === 'umkm' && step === 2 ? 'Data Usaha' : 'Daftar Sekarang'}
          </h1>
          <p className="text-blue-100 text-sm">
            {role === 'umkm' && step === 2 
              ? 'Lengkapi data usaha untuk listing' 
              : 'Mulai investasi di UMKM Indonesia'}
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 bg-white rounded-t-3xl px-4 py-8">
          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  placeholder="Nama Anda" 
                  required 
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com" 
                  required 
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">No. Telepon</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="08123456789" 
                  required 
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-base">Daftar Sebagai</Label>
                <Select value={role} onValueChange={setRole} required>
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
              <Button type="submit" className="w-full h-12 text-base font-semibold mt-6">
                {role === 'umkm' ? 'Lanjutkan' : 'Daftar'}
                {role === 'umkm' && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-base">Nama Usaha</Label>
                <Input 
                  id="businessName" 
                  placeholder="Nama usaha Anda" 
                  required 
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base">Kategori Usaha</Label>
                <Select required>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fb">Food & Beverage</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="manufacture">Manufacture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">Deskripsi Usaha</Label>
                <Textarea
                  id="description"
                  placeholder="Ceritakan tentang usaha Anda..."
                  rows={3}
                  required
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-base">Alamat</Label>
                <Textarea 
                  id="address" 
                  placeholder="Alamat lengkap usaha" 
                  rows={2} 
                  required 
                  className="text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="revenue" className="text-base">Omzet/Tahun</Label>
                  <Input 
                    id="revenue" 
                    type="number" 
                    placeholder="500000000" 
                    required 
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees" className="text-base">Karyawan</Label>
                  <Input 
                    id="employees" 
                    type="number" 
                    placeholder="10" 
                    required 
                    className="h-12 text-base"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siup" className="text-base">Izin Usaha (SIUP/NIB)</Label>
                <Input 
                  id="siup" 
                  type="file" 
                  required 
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="financialReport" className="text-base">Laporan Keuangan</Label>
                <Input 
                  id="financialReport" 
                  type="file" 
                  required 
                  className="h-12 text-base"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-12 text-base"
                  onClick={() => setStep(1)}
                >
                  Kembali
                </Button>
                <Button type="submit" className="flex-1 h-12 text-base font-semibold">
                  Daftar
                </Button>
              </div>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="text-blue-600 font-semibold">
                    Masuk
                  </Link>
                </p>
              </div>

              {/* Benefits */}
              <Card className="mt-8 bg-gray-50 border-0">
                <CardContent className="pt-5 pb-5">
                  <p className="text-sm font-semibold mb-3">Keuntungan Bergabung:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Gratis tanpa biaya</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Verifikasi cepat</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">248+ UMKM terverifikasi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
