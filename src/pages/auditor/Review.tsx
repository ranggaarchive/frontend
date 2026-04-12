import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, XCircle, FileText, Download } from 'lucide-react'

export default function AuditorReview() {
  const { umkmId } = useParams()
  const navigate = useNavigate()
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [notes, setNotes] = useState('')

  const handleApprove = () => {
    alert('UMKM berhasil disetujui untuk listing!')
    navigate('/auditor/dashboard')
  }

  const handleReject = () => {
    alert('Pengajuan UMKM ditolak.')
    navigate('/auditor/dashboard')
  }

  return (
    <Layout role="auditor">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Review Pengajuan Listing</h1>
            <p className="text-gray-500">Toko Elektronik Jaya</p>
          </div>
          <Badge variant="secondary">Pending Review</Badge>
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
                    <p className="font-medium">Toko Elektronik Jaya</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Kategori</Label>
                    <p className="font-medium">Retail</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">Deskripsi</Label>
                  <p className="font-medium">
                    Toko elektronik yang menjual berbagai peralatan elektronik rumah tangga dan gadget dengan harga kompetitif.
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Alamat</Label>
                  <p className="font-medium">Jl. Sudirman No. 456, Jakarta Pusat</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Telepon</Label>
                    <p className="font-medium">021-87654321</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="font-medium">info@elektronikjaya.com</p>
                  </div>
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
                    <p className="text-2xl font-bold">Rp 2.500.000.000</p>
                  </div>
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Laba Bersih</Label>
                    <p className="text-2xl font-bold">Rp 500.000.000</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Total Aset</Label>
                    <p className="text-2xl font-bold">Rp 1.800.000.000</p>
                  </div>
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Jumlah Karyawan</Label>
                    <p className="text-2xl font-bold">25 Orang</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded">
                  <Label className="text-gray-500">Margin Laba</Label>
                  <p className="text-xl font-bold text-blue-600">20%</p>
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
                    <p className="text-xl font-bold">50.000</p>
                  </div>
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Harga per Saham</Label>
                    <p className="text-xl font-bold">Rp 100.000</p>
                  </div>
                  <div className="p-4 border rounded">
                    <Label className="text-gray-500">Saham Ditawarkan</Label>
                    <p className="text-xl font-bold">30%</p>
                  </div>
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
                {[
                  { name: 'Izin Usaha (SIUP/NIB)', file: 'siup.pdf' },
                  { name: 'Laporan Keuangan', file: 'laporan-keuangan.pdf' },
                  { name: 'NPWP & SPT', file: 'npwp-spt.pdf' },
                  { name: 'KTP Pemilik', file: 'ktp.pdf' },
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.file}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
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
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    variant="default"
                    onClick={() => setShowApproveDialog(true)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Setujui Listing
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Tolak Listing
                  </Button>
                </div>
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
              <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                Batal
              </Button>
              <Button onClick={handleApprove}>Ya, Setujui</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tolak Listing</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menolak pengajuan listing UMKM ini?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Ya, Tolak
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
