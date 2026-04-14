import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, XCircle, FileText, Download, Loader2, AlertCircle } from 'lucide-react'
import auditorService, { type BusinessForReview } from '@/services/auditor.service'
import { toast } from 'sonner'

export default function AuditorReview() {
  const navigate = useNavigate()
  const { umkmId } = useParams<{ umkmId: string }>()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [business, setBusiness] = useState<BusinessForReview | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (umkmId) {
      loadBusinessDetail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umkmId])

  const loadBusinessDetail = async () => {
    try {
      setLoading(true)
      const data = await auditorService.getBusinessForReview(Number(umkmId))
      setBusiness(data)
      setNotes(data.reviewNotes || '')
    } catch (error: any) {
      console.error('Failed to load business:', error)
      toast.error('Gagal memuat data usaha')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    try {
      setSubmitting(true)
      await auditorService.reviewBusiness(Number(umkmId), {
        action: 'approve',
        notes: notes || undefined,
      })
      toast.success('UMKM berhasil disetujui untuk listing!')
      navigate('/auditor/dashboard')
    } catch (error: any) {
      console.error('Approve error:', error)
      toast.error(error.response?.data?.message || 'Gagal menyetujui UMKM')
    } finally {
      setSubmitting(false)
      setShowApproveDialog(false)
    }
  }

  const handleReject = async () => {
    if (!notes.trim()) {
      toast.error('Catatan wajib diisi untuk penolakan')
      return
    }

    try {
      setSubmitting(true)
      await auditorService.reviewBusiness(Number(umkmId), {
        action: 'reject',
        notes: notes,
      })
      toast.success('Pengajuan UMKM ditolak')
      navigate('/auditor/dashboard')
    } catch (error: any) {
      console.error('Reject error:', error)
      toast.error(error.response?.data?.message || 'Gagal menolak UMKM')
    } finally {
      setSubmitting(false)
      setShowRejectDialog(false)
    }
  }

  const handleDownloadDocument = (dataUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      fb: 'F&B',
      retail: 'Retail',
      fashion: 'Fashion',
      service: 'Service',
      manufacture: 'Manufacture',
    }
    return labels[category] || category
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-0">Pending Review</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">Approved</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-700 border-0">Rejected</Badge>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Layout role="auditor">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </Layout>
    )
  }

  if (!business) {
    return (
      <Layout role="auditor">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-gray-700 font-medium mb-2">Data tidak ditemukan</p>
            <Button onClick={() => navigate('/auditor/dashboard')}>Kembali ke Dashboard</Button>
          </div>
        </div>
      </Layout>
    )
  }

  const profitMargin = business.financial.annualRevenue > 0 
    ? ((business.financial.netProfit / business.financial.annualRevenue) * 100).toFixed(1)
    : '0.0'

  return (
    <Layout role="auditor">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Review Pengajuan Listing</h1>
            <p className="text-gray-500">{business.name}</p>
          </div>
          {getStatusBadge(business.status)}
        </div>

        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Informasi</TabsTrigger>
            <TabsTrigger value="financial">Keuangan</TabsTrigger>
            <TabsTrigger value="documents">Dokumen</TabsTrigger>
            <TabsTrigger value="assessment">Penilaian</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Usaha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Nama Usaha</Label>
                    <p className="font-medium">{business.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Kategori</Label>
                    <p className="font-medium">{getCategoryLabel(business.category)}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">Deskripsi</Label>
                  <p className="font-medium">{business.description}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Alamat</Label>
                  <p className="font-medium">{business.address}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Pemilik</Label>
                    <p className="font-medium">{business.owner.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="font-medium">{business.owner.email}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">Telepon</Label>
                  <p className="font-medium">{business.owner.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Tanggal Pengajuan</Label>
                  <p className="font-medium">{business.createdAt}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Data Keuangan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Omzet Tahunan</Label>
                    <p className="text-2xl font-bold">Rp {business.financial.annualRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Laba Bersih</Label>
                    <p className="text-2xl font-bold">Rp {business.financial.netProfit.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Total Aset</Label>
                    <p className="text-2xl font-bold">Rp {business.financial.totalAssets.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Jumlah Karyawan</Label>
                    <p className="text-2xl font-bold">{business.financial.employees} Orang</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded">
                  <Label className="text-gray-500">Margin Laba</Label>
                  <p className="text-xl font-bold text-blue-600">{profitMargin}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Informasi Saham</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Total Saham</Label>
                    <p className="text-xl font-bold">{business.stock.totalShares.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Harga per Saham</Label>
                    <p className="text-xl font-bold">Rp {business.stock.pricePerShare.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Saham Ditawarkan</Label>
                    <p className="text-xl font-bold">{business.stock.sharesPercentage}%</p>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded">
                  <Label className="text-gray-500">Market Cap</Label>
                  <p className="text-xl font-bold text-green-600">
                    Rp {(business.stock.totalShares * business.stock.pricePerShare).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Dokumen Pendukung</CardTitle>
                <CardDescription>Dokumen yang diupload oleh UMKM</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {business.documents.businessLicense ? (
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Izin Usaha (SIUP/NIB)</p>
                        <p className="text-sm text-gray-500">Tersedia</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadDocument(business.documents.businessLicense!, 'izin-usaha.pdf')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-400">Izin Usaha (SIUP/NIB)</p>
                        <p className="text-sm text-gray-400">Tidak tersedia</p>
                      </div>
                    </div>
                  </div>
                )}

                {business.documents.financialReport ? (
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Laporan Keuangan</p>
                        <p className="text-sm text-gray-500">Tersedia</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadDocument(business.documents.financialReport!, 'laporan-keuangan.pdf')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-400">Laporan Keuangan</p>
                        <p className="text-sm text-gray-400">Tidak tersedia</p>
                      </div>
                    </div>
                  </div>
                )}

                {business.documents.taxReport ? (
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">NPWP & SPT</p>
                        <p className="text-sm text-gray-500">Tersedia</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadDocument(business.documents.taxReport!, 'npwp-spt.pdf')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-400">NPWP & SPT</p>
                        <p className="text-sm text-gray-400">Tidak tersedia</p>
                      </div>
                    </div>
                  </div>
                )}

                {business.documents.ownerIdCard ? (
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">KTP Pemilik</p>
                        <p className="text-sm text-gray-500">Tersedia</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadDocument(business.documents.ownerIdCard!, 'ktp-pemilik.pdf')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-400">KTP Pemilik</p>
                        <p className="text-sm text-gray-400">Tidak tersedia</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment">
            <Card>
              <CardHeader>
                <CardTitle>Penilaian Auditor</CardTitle>
                <CardDescription>Berikan penilaian dan catatan Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Review</Label>
                  <Textarea
                    id="notes"
                    placeholder="Tulis catatan atau rekomendasi Anda..."
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={business.status !== 'pending'}
                  />
                  {business.status !== 'pending' && (
                    <p className="text-sm text-gray-500">
                      Usaha ini sudah di-review pada {business.reviewedAt}
                    </p>
                  )}
                </div>
                {business.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      variant="default"
                      onClick={() => setShowApproveDialog(true)}
                      disabled={submitting}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Setujui Listing
                    </Button>
                    <Button
                      className="flex-1"
                      variant="destructive"
                      onClick={() => setShowRejectDialog(true)}
                      disabled={submitting}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Tolak Listing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Setujui Listing</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menyetujui pengajuan listing UMKM ini?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowApproveDialog(false)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button onClick={handleApprove} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Ya, Setujui'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tolak Listing</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menolak pengajuan listing UMKM ini? Pastikan Anda sudah mengisi catatan penolakan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowRejectDialog(false)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={submitting || !notes.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Ya, Tolak'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
