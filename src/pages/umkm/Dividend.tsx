import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, Users, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import umkmService, { type DividendHistory } from '@/services/umkm.service'
import { toast } from 'sonner'

export default function UmkmDividend() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [history, setHistory] = useState<DividendHistory[]>([])
  const [period, setPeriod] = useState('')
  const [netProfit, setNetProfit] = useState('')
  const [dividendPercentage, setDividendPercentage] = useState('20')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const data = await umkmService.getDividendHistory()
      setHistory(data)
    } catch (error: any) {
      console.error('Failed to load dividend history:', error)
      toast.error('Gagal memuat riwayat dividen')
    } finally {
      setLoading(false)
    }
  }

  const handlePayDividend = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!period || !netProfit || !dividendPercentage) {
      toast.error('Mohon lengkapi semua field')
      return
    }

    try {
      setSubmitting(true)
      const result = await umkmService.payDividend({
        period,
        netProfit: Number(netProfit),
        dividendPercentage: Number(dividendPercentage),
        notes: notes || undefined,
      })

      toast.success(
        `Dividen berhasil dibagikan! Total Rp ${result.totalDividend.toLocaleString()} ke ${result.investorsCount} investor`
      )

      // Reset form
      setPeriod('')
      setNetProfit('')
      setDividendPercentage('20')
      setNotes('')

      // Reload history
      await loadHistory()
    } catch (error: any) {
      console.error('Pay dividend error:', error)
      toast.error(error.response?.data?.message || 'Gagal membagikan dividen')
    } finally {
      setSubmitting(false)
    }
  }

  const totalDividend = netProfit && dividendPercentage 
    ? (Number(netProfit) * Number(dividendPercentage)) / 100 
    : 0

  if (loading) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Dividen" showBack />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout role="umkm">
      <MobileHeader title="Dividen" showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Info Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Pembagian Dividen</h3>
                <p className="text-sm text-gray-700">
                  Bagikan keuntungan usaha Anda kepada para investor sebagai bentuk apresiasi atas dukungan mereka
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <h3 className="font-semibold mb-4">Bayar Dividen</h3>
            <form onSubmit={handlePayDividend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="period">Periode</Label>
                <Input
                  id="period"
                  type="text"
                  placeholder="Contoh: Q1 2024, Januari 2024"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="netProfit">Laba Bersih (Rp)</Label>
                <Input
                  id="netProfit"
                  type="number"
                  placeholder="10000000"
                  value={netProfit}
                  onChange={(e) => setNetProfit(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dividendPercentage">Persentase Dividen (%)</Label>
                <Input
                  id="dividendPercentage"
                  type="number"
                  placeholder="20"
                  value={dividendPercentage}
                  onChange={(e) => setDividendPercentage(e.target.value)}
                  required
                  min="1"
                  max="100"
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500">
                  Persentase dari laba bersih yang akan dibagikan sebagai dividen
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Tambahkan catatan atau informasi tambahan..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Summary */}
              {netProfit && dividendPercentage && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4 pb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Laba Bersih</span>
                        <span className="font-medium">Rp {Number(netProfit).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Persentase Dividen</span>
                        <span className="font-medium">{dividendPercentage}%</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-300">
                        <span className="font-semibold text-blue-900">Total Dividen</span>
                        <span className="font-bold text-lg text-blue-600">
                          Rp {totalDividend.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Bayar Dividen
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History */}
        <div>
          <h3 className="font-semibold mb-3">Riwayat Dividen</h3>
          {history.length === 0 ? (
            <Card>
              <CardContent className="pt-5 pb-5 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-1">Belum Ada Riwayat</p>
                <p className="text-sm text-gray-500">
                  Riwayat pembagian dividen akan muncul di sini
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {history.map((dividend) => (
                <Card key={dividend.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{dividend.period}</p>
                        <p className="text-xs text-gray-500">{dividend.distributedAt}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0">
                        {dividend.status === 'distributed' ? 'Dibagikan' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 mb-0.5">Laba Bersih</p>
                        <p className="font-medium">Rp {dividend.netProfit.toLocaleString()}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 mb-0.5">Persentase</p>
                        <p className="font-medium">{dividend.dividendPercentage}%</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <p className="text-xs text-gray-500 mb-0.5">Total Dividen</p>
                        <p className="font-medium text-green-600">
                          Rp {dividend.totalDividend.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <p className="text-xs text-gray-500 mb-0.5">Per Saham</p>
                        <p className="font-medium text-blue-600">
                          Rp {dividend.dividendPerShare.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {dividend.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 mb-0.5">Catatan</p>
                        <p className="text-sm">{dividend.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
