import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react'

const pendingReviews = [
  { id: 1, name: 'Toko Elektronik Jaya', category: 'Retail', submittedDate: '10 Apr 2026', status: 'pending' },
  { id: 2, name: 'Cafe Kopi Nusantara', category: 'F&B', submittedDate: '09 Apr 2026', status: 'pending' },
  { id: 3, name: 'Salon Cantik', category: 'Service', submittedDate: '08 Apr 2026', status: 'pending' },
  { id: 4, name: 'Toko Buku Pintar', category: 'Retail', submittedDate: '07 Apr 2026', status: 'pending' },
]

export default function AuditorDashboard() {
  return (
    <Layout role="auditor">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Auditor</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500 mt-1">Menunggu review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reviewed</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-gray-500 mt-1">Total keseluruhan</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Pengajuan Pending</CardTitle>
                <CardDescription>UMKM yang menunggu review Anda</CardDescription>
              </div>
              <Link to="/auditor/approved">
                <Button variant="outline">Lihat Approved</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama UMKM</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal Pengajuan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingReviews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.submittedDate}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/auditor/review/${item.id}`}>
                        <Button size="sm">Review</Button>
                      </Link>
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
