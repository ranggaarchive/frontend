import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Edit, Loader2, AlertCircle } from 'lucide-react'
import umkmService, { type BusinessDetail } from '@/services/umkm.service'
import { toast } from 'sonner'

export default function ListingDetail() {
  const [loading, setLoading] = useState(true)
  const [business, setBusiness] = useState<BusinessDetail | null>(null)

  useEffect(() => {
    loadBusinessDetail()
  }, [])

  const loadBusinessDetail = async () => {
    try {
      setLoading(true)
      const data = await umkmService.getBusinessDetail()
      setBusiness(data)
    } catch (error: any) {
      console.error('Failed to load business detail:', error)
      toast.error('Gagal memuat detail usaha')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return `Rp ${(value / 1000000).toFixed(0)}jt`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-0">
            Pending Review
          </Badge>
        )
      case 'approved':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
            Approved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700 border-0">
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Detail Listing" showBack />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  if (!business) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Detail Listing" showBack />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-700 font-medium mb-2">Data tidak ditemukan</p>
          <p className="text-sm text-gray-500 text-center mb-4">
            Terjadi kesalahan saat memuat data. Silakan coba lagi.
          </p>
          <Button onClick={loadBusinessDetail}>Coba Lagi</Button>
        </div>
      </Layout>
    )
  }

  const sharesOffered = Math.floor((business.totalShares * business.sharesPercentage) / 100)

  return (
    <Layout role="umkm">
      <MobileHeader title="Detail Listing" showBack />
      
      <div className="px-4 py-4 space-y-4">
        {/* Status */}
        <Card className={`${
          business.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
          business.status === 'approved' ? 'bg-green-50 border-green-200' :
          'bg-red-50 border-red-200'
        }`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold mb-1">Status Pengajuan</p>
                {getStatusBadge(business.status)}
              </div>
              {business.status === 'pending' && (
                <Link to="/umkm/edit-listing">
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="info">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="financial">Keuangan</TabsTrigger>
            <TabsTrigger value="documents">Dokumen</TabsTrigger>
            <TabsTrigger value="dividend">Dividen</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            <Card>
              <CardContent className="pt-5 pb-5">
                <h3 className="font-semibold mb-4">Informasi Usaha</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Nama Usaha</span>
                    <span className="font-medium text-right">{business.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Kategori</span>
                    <span className="font-medium capitalize">{business.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Alamat</span>
                    <span className="font-medium text-right">{business.address}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Karyawan</span>
                    <span className="font-medium">{business.employees} Orang</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">
                      {business.rating ? Number(business.rating).toFixed(1) : '0.0'} ({business.ratingCount} reviews)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-5">
                <h3 className="font-semibold mb-3">Deskripsi</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {business.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-4 space-y-4">
            <Card>
              <CardContent className="pt-5 pb-5">
                <h3 className="font-semibold mb-4">Data Keuangan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Omzet Tahunan</p>
                    <p className="text-lg font-bold">{formatCurrency(business.annualRevenue)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Laba Bersih</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(business.netProfit)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Total Aset</p>
                    <p className="text-lg font-bold">{formatCurrency(business.totalAssets)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Margin Laba</p>
                    <p className="text-lg font-bold text-blue-600">
                      {((business.netProfit / business.annualRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-5">
                <h3 className="font-semibold mb-4">Informasi Saham</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Total Saham</span>
                    <span className="font-medium">{business.totalShares.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Harga per Saham</span>
                    <span className="font-medium">Rp {business.pricePerShare.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Saham Ditawarkan</span>
                    <span className="font-medium">{business.sharesPercentage}% ({sharesOffered.toLocaleString()} saham)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Market Cap</span>
                    <span className="font-medium">{formatCurrency(business.pricePerShare * business.totalShares)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-4 space-y-4">
            <Card>
              <CardContent className="pt-5 pb-5">
                <h3 className="font-semibold mb-4">Dokumen Usaha</h3>
                <div className="space-y-3">
                  {business.documents.businessLicense ? (
                    <a 
                      href={business.documents.businessLicense}
                      download="izin-usaha"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">Izin Usaha (SIUP/NIB)</p>
                        <p className="text-xs text-gray-500">Klik untuk download</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                        Tersedia
                      </Badge>
                    </a>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Izin Usaha (SIUP/NIB)</p>
                        <p className="text-xs text-gray-400">Belum diupload</p>
                      </div>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-500 border-0">
                        Tidak Ada
                      </Badge>
                    </div>
                  )}

                  {business.documents.financialReport ? (
                    <a 
                      href={business.documents.financialReport}
                      download="laporan-keuangan"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">Laporan Keuangan</p>
                        <p className="text-xs text-gray-500">Klik untuk download</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                        Tersedia
                      </Badge>
                    </a>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Laporan Keuangan</p>
                        <p className="text-xs text-gray-400">Belum diupload</p>
                      </div>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-500 border-0">
                        Tidak Ada
                      </Badge>
                    </div>
                  )}

                  {business.documents.taxReport ? (
                    <a 
                      href={business.documents.taxReport}
                      download="npwp-spt"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">NPWP & SPT</p>
                        <p className="text-xs text-gray-500">Klik untuk download</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                        Tersedia
                      </Badge>
                    </a>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-400">NPWP & SPT</p>
                        <p className="text-xs text-gray-400">Belum diupload</p>
                      </div>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-500 border-0">
                        Tidak Ada
                      </Badge>
                    </div>
                  )}

                  {business.documents.ownerIdCard ? (
                    <a 
                      href={business.documents.ownerIdCard}
                      download="ktp-pemilik"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">KTP Pemilik</p>
                        <p className="text-xs text-gray-500">Klik untuk download</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                        Tersedia
                      </Badge>
                    </a>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-400">KTP Pemilik</p>
                        <p className="text-xs text-gray-400">Belum diupload</p>
                      </div>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-500 border-0">
                        Tidak Ada
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">Catatan:</span> Dokumen-dokumen ini digunakan untuk verifikasi usaha oleh auditor. Pastikan semua dokumen valid dan terbaru.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dividend" className="mt-4 space-y-4">
            {business.dividend ? (
              <>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="pt-5 pb-5">
                    <h3 className="font-semibold mb-4">Informasi Dividen</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Persentase</p>
                        <p className="text-2xl font-bold text-green-600">
                          {business.dividend.dividendPercentage}%
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Per Saham</p>
                        <p className="text-2xl font-bold text-green-600">
                          Rp {business.dividend.dividendPerShare.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between p-2 bg-white rounded-lg text-sm">
                        <span className="text-gray-600">Total Dividen</span>
                        <span className="font-medium">Rp {business.dividend.totalDividend.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-white rounded-lg text-sm">
                        <span className="text-gray-600">Periode</span>
                        <span className="font-medium">{business.dividend.period}</span>
                      </div>
                      {business.dividend.paidAt && (
                        <div className="flex justify-between p-2 bg-white rounded-lg text-sm">
                          <span className="text-gray-600">Dibayarkan</span>
                          <span className="font-medium">{business.dividend.paidAt}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-blue-800">
                      <span className="font-semibold">Catatan:</span> Dividen dibagikan berdasarkan {business.dividend.dividendPercentage}% dari laba bersih kepada pemegang saham sesuai proporsi kepemilikan.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-5 pb-5 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-1">Belum Ada Dividen</p>
                  <p className="text-sm text-gray-500">
                    Dividen akan ditampilkan setelah pembagian pertama dilakukan
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Tanggal Listing */}
        <Card className="bg-gray-50 border-0">
          <CardContent className="pt-4 pb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tanggal Pengajuan</span>
              <span className="font-medium">{business.createdAt}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
