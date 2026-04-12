import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function UmkmListingForm() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Pengajuan listing berhasil dikirim! Menunggu review auditor.')
    navigate('/umkm/dashboard')
  }

  return (
    <Layout role="umkm">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Form Pengajuan Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Usaha</CardTitle>
              <CardDescription>Data dasar tentang usaha Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nama Usaha</Label>
                <Input id="businessName" placeholder="Nama usaha Anda" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori Usaha</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fb">Food & Beverage</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="manufacture">Manufacture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Usaha</Label>
                <Textarea
                  id="description"
                  placeholder="Ceritakan tentang usaha Anda..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea id="address" placeholder="Alamat lengkap usaha" rows={3} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Keuangan</CardTitle>
              <CardDescription>Data keuangan usaha Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="revenue">Omzet Tahunan</Label>
                  <Input id="revenue" type="number" placeholder="500000000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profit">Laba Bersih Tahunan</Label>
                  <Input id="profit" type="number" placeholder="100000000" required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assets">Total Aset</Label>
                  <Input id="assets" type="number" placeholder="300000000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees">Jumlah Karyawan</Label>
                  <Input id="employees" type="number" placeholder="10" required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Saham</CardTitle>
              <CardDescription>Detail penawaran saham untuk investor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalShares">Total Saham</Label>
                  <Input id="totalShares" type="number" placeholder="10000" required />
                  <p className="text-xs text-gray-500">Total saham yang akan diterbitkan</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerShare">Harga per Saham</Label>
                  <Input id="pricePerShare" type="number" placeholder="50000" required />
                  <p className="text-xs text-gray-500">Harga awal per lembar saham</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sharesOffered">Persentase Saham yang Dijual (%)</Label>
                <Input id="sharesOffered" type="number" placeholder="20" min="1" max="49" required />
                <p className="text-xs text-gray-500">
                  Contoh: Jika 20%, maka dividen = 20% dari laba bersih akan dibagikan ke investor
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Catatan:</strong> Persentase saham yang Anda jual akan menentukan pembagian dividen. 
                  Misalnya jika Anda menjual 20% saham, maka 20% dari laba bersih akan dibagikan sebagai dividen kepada investor.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dokumen Pendukung</CardTitle>
              <CardDescription>Upload dokumen yang diperlukan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessLicense">Izin Usaha (SIUP/NIB)</Label>
                <Input id="businessLicense" type="file" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="financialReport">Laporan Keuangan</Label>
                <Input id="financialReport" type="file" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxReport">NPWP & SPT</Label>
                <Input id="taxReport" type="file" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerKTP">KTP Pemilik</Label>
                <Input id="ownerKTP" type="file" required />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/umkm/dashboard')}>
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              Kirim Pengajuan
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
