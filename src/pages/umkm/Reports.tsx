import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileText, Upload, Loader2, Download } from 'lucide-react'
import umkmService, { type FinancialReport } from '@/services/umkm.service'
import { toast } from 'sonner'

export default function UmkmReports() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reports, setReports] = useState<FinancialReport[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    period: '',
    revenue: '',
    expenses: '',
    netProfit: '',
    notes: '',
  })

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setLoading(true)
      const data = await umkmService.getFinancialReports()
      setReports(data)
    } catch (error: any) {
      console.error('Failed to load reports:', error)
      toast.error('Gagal memuat laporan keuangan')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.period || !formData.revenue || !formData.expenses || !formData.netProfit) {
      toast.error('Lengkapi semua field yang diperlukan')
      return
    }

    try {
      setSubmitting(true)
      
      await umkmService.uploadFinancialReport({
        period: formData.period,
        revenue: Number(formData.revenue),
        expenses: Number(formData.expenses),
        netProfit: Number(formData.netProfit),
        notes: formData.notes || undefined,
      }, selectedFile || undefined)
      
      toast.success('Laporan berhasil diupload!')
      setOpen(false)
      
      // Reset form
      setFormData({
        period: '',
        revenue: '',
        expenses: '',
        netProfit: '',
        notes: '',
      })
      setSelectedFile(null)
      
      // Reload reports
      loadReports()
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Gagal mengupload laporan')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownload = async (reportId: number) => {
    try {
      const { file, period } = await umkmService.downloadFinancialReport(reportId)
      
      // Create download link
      const link = document.createElement('a')
      link.href = file
      link.download = `laporan-${period}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('File berhasil didownload')
    } catch (error: any) {
      console.error('Download error:', error)
      toast.error('Gagal mendownload file')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-0">Disetujui</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-0">Ditolak</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 border-0">Pending</Badge>
    }
  }

  return (
    <Layout role="umkm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Laporan Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Laporan Keuangan</DialogTitle>
                <DialogDescription>
                  Upload laporan keuangan triwulanan atau tahunan
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Periode</Label>
                  <Input 
                    id="period" 
                    placeholder="Q1 2026" 
                    required 
                    value={formData.period}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Pendapatan</Label>
                    <Input 
                      id="revenue" 
                      type="number" 
                      placeholder="150000000" 
                      required 
                      value={formData.revenue}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Pengeluaran</Label>
                    <Input 
                      id="expenses" 
                      type="number" 
                      placeholder="120000000" 
                      required 
                      value={formData.expenses}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="netProfit">Laba Bersih</Label>
                  <Input 
                    id="netProfit" 
                    type="number" 
                    placeholder="30000000" 
                    required 
                    value={formData.netProfit}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Catatan tambahan..." 
                    rows={3} 
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File Laporan (PDF/Image)</Label>
                  <Input 
                    id="file" 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-gray-500">Opsional - Format: PDF, JPG, PNG (Max 10MB)</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpen(false)}
                    disabled={submitting}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengupload...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Laporan</CardTitle>
            <CardDescription>Laporan keuangan yang telah diupload</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Belum ada laporan keuangan</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead className="text-right">Pendapatan</TableHead>
                    <TableHead className="text-right">Pengeluaran</TableHead>
                    <TableHead className="text-right">Laba Bersih</TableHead>
                    <TableHead>Tanggal Upload</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.period}</TableCell>
                      <TableCell className="text-right">Rp {report.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">Rp {report.expenses.toLocaleString()}</TableCell>
                      <TableCell className="text-right">Rp {report.netProfit.toLocaleString()}</TableCell>
                      <TableCell>{report.createdAt}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        {report.hasFile && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownload(report.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
