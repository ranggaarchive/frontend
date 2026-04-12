import { useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileText, Upload } from 'lucide-react'

const reports = [
  { id: 1, period: 'Q4 2025', revenue: 150000000, profit: 30000000, date: '15 Jan 2026', status: 'approved' },
  { id: 2, period: 'Q3 2025', revenue: 140000000, profit: 28000000, date: '15 Oct 2025', status: 'approved' },
  { id: 3, period: 'Q2 2025', revenue: 135000000, profit: 27000000, date: '15 Jul 2025', status: 'approved' },
  { id: 4, period: 'Q1 2025', revenue: 130000000, profit: 26000000, date: '15 Apr 2025', status: 'approved' },
]

export default function UmkmReports() {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Laporan berhasil diupload!')
    setOpen(false)
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
                  <Input id="period" placeholder="Q1 2026" required />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Omzet</Label>
                    <Input id="revenue" type="number" placeholder="150000000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profit">Laba Bersih</Label>
                    <Input id="profit" type="number" placeholder="30000000" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea id="notes" placeholder="Catatan tambahan..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File Laporan (PDF)</Label>
                  <Input id="file" type="file" accept=".pdf" required />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit">Upload</Button>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Periode</TableHead>
                  <TableHead className="text-right">Omzet</TableHead>
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
                    <TableCell className="text-right">Rp {report.profit.toLocaleString()}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {report.status === 'approved' ? 'Disetujui' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
