import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, CheckCircle } from 'lucide-react'

const approvedList = [
  { id: 1, name: 'Warung Makan Sederhana', category: 'F&B', approvedDate: '15 Jan 2026', auditor: 'Ahmad Yani' },
  { id: 2, name: 'Toko Kelontong Jaya', category: 'Retail', approvedDate: '20 Jan 2026', auditor: 'Siti Nurhaliza' },
  { id: 3, name: 'Konveksi Berkah', category: 'Fashion', approvedDate: '25 Jan 2026', auditor: 'Ahmad Yani' },
  { id: 4, name: 'Bengkel Motor Sejahtera', category: 'Service', approvedDate: '01 Feb 2026', auditor: 'Budi Santoso' },
  { id: 5, name: 'Laundry Express', category: 'Service', approvedDate: '05 Feb 2026', auditor: 'Ahmad Yani' },
  { id: 6, name: 'Toko Bangunan Makmur', category: 'Retail', approvedDate: '10 Feb 2026', auditor: 'Siti Nurhaliza' },
  { id: 7, name: 'Warung Kopi Nusantara', category: 'F&B', approvedDate: '15 Feb 2026', auditor: 'Ahmad Yani' },
  { id: 8, name: 'Toko Bunga Indah', category: 'Retail', approvedDate: '20 Feb 2026', auditor: 'Budi Santoso' },
]

export default function AuditorApproved() {
  return (
    <Layout role="auditor">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">UMKM Approved</h1>
            <p className="text-gray-500">Daftar UMKM yang telah disetujui untuk listing</p>
          </div>
          <Link to="/auditor/dashboard">
            <Button variant="outline">Kembali ke Dashboard</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Cari UMKM..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar UMKM Approved</CardTitle>
            <CardDescription>Total {approvedList.length} UMKM telah disetujui</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama UMKM</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal Approved</TableHead>
                  <TableHead>Auditor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.approvedDate}</TableCell>
                    <TableCell>{item.auditor}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
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
