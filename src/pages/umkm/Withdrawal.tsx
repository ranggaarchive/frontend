import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Loader2 } from 'lucide-react'
import umkmService, { type BalanceData } from '@/services/umkm.service'
import { toast } from 'sonner'

export default function UmkmWithdrawal() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    notes: '',
  })

  useEffect(() => {
    loadBalance()
  }, [])

  const loadBalance = async () => {
    try {
      setLoading(true)
      const data = await umkmService.getBalance()
      setBalanceData(data)
    } catch (error: any) {
      console.error('Failed to load balance:', error)
      toast.error('Gagal memuat data saldo')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const amount = parseFloat(formData.amount)

    if (!amount || amount <= 0) {
      toast.error('Masukkan jumlah penarikan yang valid')
      return
    }

    if (amount < 50000) {
      toast.error('Minimal penarikan Rp 50.000')
      return
    }

    if (balanceData && amount > balanceData.availableBalance) {
      toast.error('Saldo tidak mencukupi')
      return
    }

    if (!formData.bankName || !formData.accountNumber || !formData.accountName) {
      toast.error('Lengkapi semua data rekening')
      return
    }

    try {
      setSubmitting(true)
      await umkmService.requestWithdrawal({
        amount,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        notes: formData.notes || undefined,
      })
      toast.success('Permintaan penarikan berhasil dibuat')
      navigate('/umkm/balance')
    } catch (error: any) {
      console.error('Failed to request withdrawal:', error)
      toast.error(error.response?.data?.message || 'Gagal membuat permintaan penarikan')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '')
    setFormData({ ...formData, amount: numericValue })
  }

  const setQuickAmount = (amount: number) => {
    setFormData({ ...formData, amount: amount.toString() })
  }

  if (loading) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Tarik Dana" showBack />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  if (!balanceData) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Tarik Dana" showBack />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-gray-500">Gagal memuat data saldo</p>
        </div>
      </Layout>
    )
  }

  const amount = parseFloat(formData.amount) || 0

  return (
    <Layout role="umkm">
      <MobileHeader title="Tarik Dana" showBack />
      
      <div className="px-4 py-4 space-y-4">
        {/* Balance Info */}
        <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0">
          <CardContent className="pt-4 pb-4">
            <p className="text-green-100 text-sm mb-1">Saldo Tersedia</p>
            <h2 className="text-2xl font-bold">
              Rp {balanceData.availableBalance.toLocaleString('id-ID')}
            </h2>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <Card>
            <CardContent className="pt-5 pb-5">
              <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
                Jumlah Penarikan
              </Label>
              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  Rp
                </span>
                <Input
                  id="amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  className="pl-10 h-12 text-lg font-semibold"
                  value={formData.amount ? parseInt(formData.amount).toLocaleString('id-ID') : ''}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  required
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickAmount(100000)}
                >
                  100k
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickAmount(500000)}
                >
                  500k
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickAmount(1000000)}
                >
                  1jt
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickAmount(balanceData.availableBalance)}
                  disabled={balanceData.availableBalance < 50000}
                >
                  Max
                </Button>
              </div>

              {amount > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Jumlah Penarikan</span>
                    <span className="font-medium">Rp {amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                    <span>Total Diterima</span>
                    <span className="text-green-600">Rp {amount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardContent className="pt-5 pb-5 space-y-4">
              <div>
                <Label htmlFor="bankName" className="text-sm font-medium mb-2 block">
                  Nama Bank
                </Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder="Contoh: BCA, Mandiri, BNI"
                  className="h-11"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="accountNumber" className="text-sm font-medium mb-2 block">
                  Nomor Rekening
                </Label>
                <Input
                  id="accountNumber"
                  type="text"
                  inputMode="numeric"
                  placeholder="1234567890"
                  className="h-11"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/[^0-9]/g, '') })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="accountName" className="text-sm font-medium mb-2 block">
                  Nama Pemilik Rekening
                </Label>
                <Input
                  id="accountName"
                  type="text"
                  placeholder="Sesuai dengan rekening bank"
                  className="h-11"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
                  Catatan (Opsional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Tambahkan catatan jika diperlukan"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4 pb-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Informasi Penting</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Minimal penarikan Rp 50.000</li>
                    <li>Proses penarikan 1-3 hari kerja</li>
                    <li>Pastikan data rekening sudah benar</li>
                    <li>Dana akan ditransfer ke rekening yang terdaftar</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12"
            disabled={submitting || amount < 50000 || amount > balanceData.availableBalance}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              'Ajukan Penarikan'
            )}
          </Button>
        </form>
      </div>
    </Layout>
  )
}
