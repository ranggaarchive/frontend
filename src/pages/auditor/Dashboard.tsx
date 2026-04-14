import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Clock, CheckCircle, XCircle, FileText, Loader2, AlertCircle } from 'lucide-react'
import auditorService, { type DashboardData } from '@/services/auditor.service'
import { toast } from 'sonner'

export default function AuditorDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const data = await auditorService.getDashboard()
      setDashboardData(data)
    } catch (error: any) {
      console.error('Failed to load dashboard:', error)
      toast.error('Gagal memuat dashboard')
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

  if (loading) {
    return (
      <Layout role="auditor">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard Auditor</h1>
          <div className="flex items-center justify-center h-[calc(100vh-300px)]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </Layout>
    )
  }

  if (!dashboardData) {
    return (
      <Layout role="auditor">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard Auditor</h1>
          <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-gray-700 font-medium mb-2">Gagal memuat data</p>
            <Button onClick={loadDashboard}>Coba Lagi</Button>
          </div>
        </div>
      </Layout>
    )
  }

  const { stats, pendingBusinesses } = dashboardData

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
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-gray-500 mt-1">Menunggu review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedThisMonth}</div>
              <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejectedThisMonth}</div>
              <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reviewed</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviewed}</div>
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
            {pendingBusinesses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Tidak ada pengajuan yang menunggu review</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama UMKM</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Pemilik</TableHead>
                    <TableHead>Tanggal Pengajuan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingBusinesses.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{getCategoryLabel(item.category)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{item.owner.name}</p>
                          <p className="text-xs text-gray-500">{item.owner.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.submittedDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-0">
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
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
