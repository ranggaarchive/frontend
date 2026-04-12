import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Download, Edit } from 'lucide-react'

export default function ListingDetail() {
  return (
    <Layout role="umkm">
      <MobileHeader title="Detail Listing" showBack />
      
      <div className="px-4 py-4 space-y-4">
        {/* Status */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold mb-1">Status Pengajuan</p>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-0">
                  Pending Review
                </Badge>
              </div>
              <Link to="/umkm/edit-listing">
                <Button size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="info">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="financial">Keuangan</TabsTrigger>
            <TabsTrigger value="docs">Dokumen</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            <Card>
              <CardContent className="pt-5 pb-5">
                <h3 className="font-semibold mb-4">Informasi Usaha</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Nama Usaha</span>
                    <span className="font-medium text-right">Warung Makan Sederhana</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Kategori</span>
                    <span className="font-medium">Food & Beverage</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Alamat</span>
                    <span className="font-medium text-right">Jl. Raya Bogor No. 123, Jakarta Timur</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Telepon</span>
                    <span className="font-medium">021-12345678</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">info@warungmakan.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-5">
                <h3 className="font-semibold mb-3">Deskripsi</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Warung makan yang menyediakan berbagai menu masakan Indonesia dengan harga terjangkau. Sudah berdiri sejak 2020 dan memiliki pelanggan tetap yang loyal.
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
                    <p className="text-lg font-bold">Rp 600jt</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Laba Bersih</p>
                    <p className="text-lg font-bold text-green-600">Rp 120jt</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Total Aset</p>
                    <p className="text-lg font-bold">Rp 350jt</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Karyawan</p>
                    <p className="text-lg font-bold">12 Orang</p>
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
                    <span className="font-medium">10.000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Harga per Saham</span>
                    <span className="font-medium">Rp 50.000</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Saham Ditawarkan</span>
                    <span className="font-medium">30% (3.000 saham)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="mt-4 space-y-3">
            {[
              { name: 'Izin Usaha (SIUP/NIB)', file: 'siup.pdf', size: '2.4 MB' },
              { name: 'Laporan Keuangan', file: 'laporan-keuangan.pdf', size: '1.8 MB' },
              { name: 'NPWP & SPT', file: 'npwp-spt.pdf', size: '1.2 MB' },
              { name: 'KTP Pemilik', file: 'ktp.pdf', size: '0.8 MB' },
            ].map((doc) => (
              <Card key={doc.name}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.file} • {doc.size}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
