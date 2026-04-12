import { useState } from 'react'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { DollarSign, Users, TrendingUp, AlertCircle, CheckCircle, Calendar } from 'lucide-react'

// Data simulasi
const businessData = {
  name: 'Warung Makan Sederhana',
  totalShares: 10000,
  sharesListed: 2000, // 20% dijual
  sharesSold: 1800, // 18% sudah terjual
  percentageListed: 20,
  percentageSold: 18,
  totalInvestors: 248,
  lastProfit: 120000000, // Rp 120jt
}

const dividendHistory = [
  { id: 1, period: 'Q4 2025', profit: 120000000, dividend: 24000000, date: '20 Jan 2026', status: 'distributed' },
  { id: 2, period: 'Q3 2025', profit: 115000000, dividend: 23000000, date: '20 Oct 2025', status: 'distributed' },
  { id: 3, period: 'Q2 2025', profit: 110000000, dividend: 22000000, date: '20 Jul 2025', status: 'distributed' },
]

export default function UmkmDividend() {
  const [profit, setProfit] = useState('')
  const [notes, setNotes] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowModal(true)
  }

  const handleConfirm = () => {
    alert('Dividen berhasil didistribusikan!')
    setShowModal(false)
    setProfit('')
    setNotes('')
  }

  const calculatedDividend = profit ? (parseInt(profit) * businessData.percentageListed) / 100 : 0

  return (
    <Layout role="umkm">
      <MobileHeader title="Distribusi Dividen" showBack />
      
      <div className="px-4 py-4 space-y-4">
        {/* Business Info */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-xl font-bold mb-4">{businessData.name}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-blue-100 text-xs mb-1">Saham Dijual</p>
                <p className="text-2xl font-bold">{businessData.percentageSold}%</p>
                <p className="text-xs text-blue-100">{businessData.sharesSold} dari {businessData.sharesListed} saham</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Total Investor</p>
                <p className="text-2xl font-bold">{businessData.totalInvestors}</p>
                <p className="text-xs text-blue-100">Pemegang saham</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Cara Kerja Dividen</p>
                <ul className="space-y-1 text-xs">
                  <li>• Anda menjual {businessData.percentageListed}% saham dari total {businessData.totalShares.toLocaleString()} saham</li>
                  <li>• Dividen = {businessData.percentageListed}% dari laba bersih</li>
                  <li>• Dibagi otomatis ke {businessData.totalInvestors} investor sesuai porsi kepemilikan</li>
                  <li>• Saldo dividen langsung masuk ke akun investor</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Distribusi */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <h3 className="font-semibold mb-4">Distribusi Dividen Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profit" className="text-base">Laba Bersih Periode Ini</Label>
                <Input
                  id="profit"
                  type="number"
                  placeholder="120000000"
                  value={profit}
                  onChange={(e) => setProfit(e.target.value)}
                  required
                  className="h-12 text-base"
                />
                <p className="text-xs text-gray-500">Masukkan total laba bersih dari laporan keuangan</p>
              </div>

              {profit && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4 pb-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Laba Bersih</span>
                        <span className="font-semibold">Rp {parseInt(profit).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Persentase Saham Dijual</span>
                        <span className="font-semibold">{businessData.percentageListed}%</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-green-300">
                        <span className="font-semibold text-green-700">Total Dividen</span>
                        <span className="font-bold text-lg text-green-700">
                          Rp {calculatedDividend.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 pt-2">
                        Akan didistribusikan ke {businessData.totalInvestors} investor sesuai porsi kepemilikan masing-masing
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-base">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan untuk investor..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="text-base"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={!profit || parseInt(profit) <= 0}
              >
                <DollarSign className="h-5 w-5 mr-2" />
                Distribusikan Dividen
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History */}
        <div>
          <h3 className="font-semibold mb-3">Riwayat Distribusi</h3>
          <div className="space-y-3">
            {dividendHistory.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm">{item.period}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Terdistribusi
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                        <div>
                          <p className="text-gray-500">Laba Bersih</p>
                          <p className="font-semibold">Rp {(item.profit / 1000000).toFixed(0)}jt</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Dividen</p>
                          <p className="font-semibold text-green-600">Rp {(item.dividend / 1000000).toFixed(0)}jt</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Konfirmasi Distribusi</h3>
              <p className="text-sm text-gray-600">
                Pastikan data sudah benar sebelum mendistribusikan dividen
              </p>
            </div>

            <Card className="bg-gray-50 border-0 mb-6">
              <CardContent className="pt-4 pb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Laba Bersih</span>
                    <span className="font-semibold">Rp {parseInt(profit).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Dividen ({businessData.percentageListed}%)</span>
                    <span className="font-semibold text-green-600">
                      Rp {calculatedDividend.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Penerima</span>
                    <span className="font-semibold">{businessData.totalInvestors} investor</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 h-11"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="flex-1 h-11"
              >
                Konfirmasi
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
