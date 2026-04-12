import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Layout from '@/components/Layout'
import { TrendingUp, Building2, Shield, Users, BarChart3, CheckCircle, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
        {/* Hero Section */}
        <div className="px-4 pt-8 pb-12 text-white">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Platform Investasi Terpercaya
            </Badge>
            <h1 className="text-3xl font-bold mb-3 leading-tight">
              Investasi di UMKM Indonesia
            </h1>
            <p className="text-blue-100 mb-6 text-sm leading-relaxed">
              Mulai dari Rp 25.000 dengan return hingga 18.5% per tahun
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/register" className="w-full">
                <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  Mulai Investasi
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login" className="w-full">
                <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10">
                  Masuk
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-4 pb-4 text-center">
                <Building2 className="h-8 w-8 mx-auto mb-2 text-white" />
                <p className="text-2xl font-bold text-white mb-0.5">248+</p>
                <p className="text-xs text-blue-100">UMKM Terdaftar</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-4 pb-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-white" />
                <p className="text-2xl font-bold text-white mb-0.5">15K+</p>
                <p className="text-xs text-blue-100">Investor Aktif</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-4 pb-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-white" />
                <p className="text-2xl font-bold text-white mb-0.5">Rp 125M</p>
                <p className="text-xs text-blue-100">Total Investasi</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-4 pb-4 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-white" />
                <p className="text-2xl font-bold text-white mb-0.5">18.5%</p>
                <p className="text-xs text-blue-100">Avg Return</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-t-3xl px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Kenapa Memilih Kami?</h2>
            <p className="text-gray-600 text-sm">Platform investasi UMKM terpercaya</p>
          </div>

          <div className="space-y-4 mb-8">
            <Card className="border-2">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Untuk Investor</h3>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>UMKM terverifikasi auditor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Trading real-time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Portfolio management</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Untuk Pemilik UMKM</h3>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Listing mudah dan cepat</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Akses ribuan investor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Dashboard monitoring</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Untuk Auditor</h3>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Review pengajuan listing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Validasi dokumen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Sistem terintegrasi</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="py-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Siap Memulai?</h2>
              <p className="text-blue-100 mb-6 text-sm">
                Bergabung dengan ribuan investor
              </p>
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
