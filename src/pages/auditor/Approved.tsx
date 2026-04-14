import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import auditorService, { type ApprovedBusiness } from '@/services/auditor.service'
import { toast } from 'sonner'

export default function AuditorApproved() {
  const [loading, setLoading] = useState(true)
  const [businesses, setBusinesses] = useState<ApprovedBusiness[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadApprovedBusinesses()
  }, [])

  const loadApprovedBusinesses = async () => {
    try {
      setLoading(true)
      const data = await auditorService.getApprovedBusinesses()
      setBusinesses(data)
    } catch (error: any) {
      console.error('Failed to load approved businesses:', error)
      toast.error('Gagal memuat daftar UMKM approved')
    } finally {
      setLoading(false)
    }
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

  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Layout role="auditor">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">UMKM Approved</h1>
          <div className="flex items-center justify-center h-[calc(100vh-300px)]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </Layout>
    )
  }

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
              <Input 
                placeholder="Cari UMKM..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar UMKM Approved</CardTitle>
            <CardDescription>Total {filteredBusinesses.length} UMKM telah disetujui</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-1">
                  {searchQuery ? 'UMKM tidak ditemukan' : 'Belum ada UMKM yang disetujui'}
                </p>
                <p className="text-sm text-gray-500">
                  {searchQuery ? 'Coba kata kunci lain' : 'UMKM yang Anda setujui akan muncul di sini'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama UMKM</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Pemilik</TableHead>
                    <TableHead>Tanggal Approved</TableHead>
                    <TableHead>Tanggal Listed</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{getCategoryLabel(item.category)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{item.owner.name}</p>
                          <p className="text-xs text-gray-500">{item.owner.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.reviewedAt}</TableCell>
                      <TableCell>{item.listedAt}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-0">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
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
