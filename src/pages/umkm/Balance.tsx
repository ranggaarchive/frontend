import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, Loader2, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'
import umkmService, { type BalanceData } from '@/services/umkm.service'
import { toast } from 'sonner'

export default function UmkmBalance() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)

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

  const handleWithdraw = () => {
    navigate('/umkm/withdrawal')
  }

  const handleCancelWithdrawal = async (withdrawalId: number) => {
    if (!confirm('Yakin ingin membatalkan penarikan ini?')) return

    try {
      await umkmService.cancelWithdrawal(withdrawalId)
      toast.success('Penarikan berhasil dibatalkan')
      loadBalance()
    } catch (error: any) {
      console.error('Failed to cancel withdrawal:', error)
      toast.error('Gagal membatalkan penarikan')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 border-0">
            <CheckCircle className="h-3 w-3 mr-1" />
            Selesai
          </Badge>
        )
      case 'processing':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-0">
            <Clock className="h-3 w-3 mr-1" />
            Diproses
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-0">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700 border-0">
            <XCircle className="h-3 w-3 mr-1" />
            Ditolak
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Saldo" showBack />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    )
  }

  if (!balanceData) {
    return (
      <Layout role="umkm">
        <MobileHeader title="Saldo" showBack />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-gray-500">Gagal memuat data saldo</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout role="umkm">
      <MobileHeader title="Saldo" showBack />
      
      <div className="px-4 py-4 space-y-4">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-green-100 text-sm mb-1">Saldo Tersedia</p>
                <h2 className="text-3xl font-bold">
                  Rp {(balanceData.availableBalance / 1000000).toFixed(2)}jt
                </h2>
              </div>
              <Wallet className="h-12 w-12 text-green-200" />
            </div>
            <Button 
              className="w-full bg-white text-green-600 hover:bg-gray-100"
              onClick={handleWithdraw}
              disabled={balanceData.availableBalance < 50000}
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Tarik Dana
            </Button>
            {balanceData.availableBalance < 50000 && (
              <p className="text-xs text-green-100 mt-2 text-center">
                Minimal penarikan Rp 50.000
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-1 text-green-600" />
              <p className="text-xs text-gray-500 mb-1">Total Pendapatan</p>
              <p className="font-bold text-sm">
                Rp {(balanceData.totalEarnings / 1000000).toFixed(1)}jt
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingDown className="h-6 w-6 mx-auto mb-1 text-blue-600" />
              <p className="text-xs text-gray-500 mb-1">Total Ditarik</p>
              <p className="font-bold text-sm">
                Rp {(balanceData.totalWithdrawn / 1000000).toFixed(1)}jt
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-1 text-yellow-600" />
              <p className="text-xs text-gray-500 mb-1">Pending</p>
              <p className="font-bold text-sm">
                Rp {(balanceData.pendingWithdrawal / 1000000).toFixed(1)}jt
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informasi Saldo</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Saldo berasal dari penjualan saham di marketplace</li>
                  <li>Minimal penarikan Rp 50.000</li>
                  <li>Proses penarikan 1-3 hari kerja</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <div>
          <h3 className="font-semibold mb-3">Riwayat Penarikan</h3>
          {balanceData.withdrawals.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-1">Belum ada riwayat penarikan</p>
                <p className="text-sm text-gray-500">
                  Penarikan Anda akan muncul di sini
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {balanceData.withdrawals.map((withdrawal) => (
                <Card key={withdrawal.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">
                            Rp {withdrawal.amount.toLocaleString('id-ID')}
                          </p>
                          {getStatusBadge(withdrawal.status)}
                        </div>
                        <p className="text-xs text-gray-600">
                          {withdrawal.bankName} • {withdrawal.accountNumber}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {withdrawal.createdAt}
                        </p>
                      </div>
                      {withdrawal.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleCancelWithdrawal(withdrawal.id)}
                        >
                          Batal
                        </Button>
                      )}
                    </div>
                    {withdrawal.notes && (
                      <div className="pt-3 border-t">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Catatan:</span> {withdrawal.notes}
                        </p>
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
