import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Layout from '@/components/Layout'
import { Building2, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import authService, { type RegisterRequest } from '@/services/auth.service'
import { toast } from 'sonner'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState<'investor' | 'umkm' | 'auditor' | ''>('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Step 1 form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
  })
  
  // Step 2 form data (UMKM)
  const [businessData, setBusinessData] = useState({
    businessName: '',
    category: '' as 'fb' | 'retail' | 'fashion' | 'service' | 'manufacture' | '',
    description: '',
    address: '',
    annualRevenue: '',
    employees: '',
  })

  const handleStep1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleStep2Change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBusinessData({
      ...businessData,
      [e.target.id]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!role) {
      toast.error('Pilih role terlebih dahulu')
      return
    }
    
    if (role === 'umkm' && step === 1) {
      // Validate step 1 before going to step 2
      if (formData.password !== formData.passwordConfirmation) {
        toast.error('Password tidak cocok')
        return
      }
      if (formData.password.length < 8) {
        toast.error('Password minimal 8 karakter')
        return
      }
      setStep(2)
      return
    }

    // Validate password for non-UMKM
    if (step === 1) {
      if (formData.password !== formData.passwordConfirmation) {
        toast.error('Password tidak cocok')
        return
      }
      if (formData.password.length < 8) {
        toast.error('Password minimal 8 karakter')
        return
      }
    }

    try {
      setLoading(true)
      
      const registerData: RegisterRequest = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: role as 'investor' | 'umkm' | 'auditor',
      }

      // Add business data for UMKM
      if (role === 'umkm' && step === 2) {
        registerData.businessName = businessData.businessName
        registerData.category = businessData.category as 'fb' | 'retail' | 'fashion' | 'service' | 'manufacture'
        registerData.description = businessData.description
        registerData.address = businessData.address
        registerData.annualRevenue = Number(businessData.annualRevenue)
        registerData.employees = Number(businessData.employees)
      }

      const response = await authService.register(registerData)
      
      toast.success(response.message || 'Registrasi berhasil!')
      
      // Redirect based on role
      if (role === 'investor') {
        navigate('/investor/dashboard')
      } else if (role === 'umkm') {
        navigate('/umkm/dashboard')
      } else if (role === 'auditor') {
        navigate('/auditor/dashboard')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.')
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
                <Label htmlFor="fullName" className="text-base">Nama Lengkap</Label>
                <Input 
                  id="fullName" 
                  placeholder="Nama Anda" 
                  required 
                  className="h-12 text-base"
                  value={formData.fullName}
                  onChange={handleStep1Change}
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
                  value={formData.email}
                  onChange={handleStep1Change}
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
                  value={formData.phone}
                  onChange={handleStep1Change}
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
                  minLength={8}
                  value={formData.password}
                  onChange={handleStep1Change}
                />
                <p className="text-xs text-gray-500">Minimal 8 karakter</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirmation" className="text-base">Konfirmasi Password</Label>
                <Input 
                  id="passwordConfirmation" 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  className="h-12 text-base"
                  minLength={8}
                  value={formData.passwordConfirmation}
                  onChange={handleStep1Change}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-base">Daftar Sebagai</Label>
                <Select value={role} onValueChange={(v) => setRole(v as any)} required>
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
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold mt-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    {role === 'umkm' ? 'Lanjutkan' : 'Daftar'}
                    {role === 'umkm' && <ArrowRight className="ml-2 h-5 w-5" />}
                  </>
                )}
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
                  value={businessData.businessName}
                  onChange={handleStep2Change}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base">Kategori Usaha</Label>
                <Select 
                  value={businessData.category} 
                  onValueChange={(v) => setBusinessData({ ...businessData, category: v as any })}
                  required
                >
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
                  value={businessData.description}
                  onChange={handleStep2Change}
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
                  value={businessData.address}
                  onChange={handleStep2Change}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="annualRevenue" className="text-base">Omzet/Tahun</Label>
                  <Input 
                    id="annualRevenue" 
                    type="number" 
                    placeholder="500000000" 
                    required 
                    className="h-12 text-base"
                    value={businessData.annualRevenue}
                    onChange={handleStep2Change}
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
                    value={businessData.employees}
                    onChange={handleStep2Change}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-12 text-base"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Kembali
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-12 text-base font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Daftar'
                  )}
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
