import { useState } from 'react'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet, CreditCard, Building2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

const paymentMethods = [
  { id: 'bca', name: 'BCA Virtual Account', icon: Building2, fee: 0 },
  { id: 'mandiri', name: 'Mandiri Virtual Account', icon: Building2, fee: 0 },
  { id: 'bni', name: 'BNI Virtual Account', icon: Building2, fee: 0 },
  { id: 'bri', name: 'BRI Virtual Account', icon: Building2, fee: 0 },
  { id: 'gopay', name: 'GoPay', icon: Wallet, fee: 0 },
  { id: 'ovo', name: 'OVO', icon: Wallet, fee: 0 },
  { id: 'dana', name: 'DANA', icon: Wallet, fee: 0 },
  { id: 'credit_card', name: 'Credit Card', icon: CreditCard, fee: 2.9 },
]

const quickAmounts = [100000, 500000, 1000000, 5000000]

export default function InvestorDeposit() {
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('')

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulasi redirect ke Midtrans
    alert(`Redirect ke Midtrans untuk deposit Rp ${parseInt(amount).toLocaleString()} via ${selectedMethod}`)
    // TODO: Integrate with Midtrans
    // window.location.href = midtransPaymentUrl
  }

  const selectedPayment = paymentMethods.find(m => m.id === selectedMethod)
  const totalAmount = amount ? parseInt(amount) + (selectedPayment?.fee ? parseInt(amount) * selectedPayment.fee / 100 : 0) : 0

  return (
    <Layout role="investor">
      <MobileHeader title="Deposit" showBack />
      
      <div className="px-4 py-4 space-y-4">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="pt-5 pb-5">
            <p className="text-blue-100 text-sm mb-1">Saldo Tersedia</p>
            <h2 className="text-3xl font-bold mb-3">Rp 2.500.000</h2>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Verified Account</span>
            </div>
          </CardContent>
        </Card>

        {/* Amount Input */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <h3 className="font-semibold mb-4">Jumlah Deposit</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base">Nominal</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Masukkan nominal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickAmounts.map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(amt.toString())}
                    className="h-10"
                  >
                    Rp {(amt / 1000).toFixed(0)}k
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <h3 className="font-semibold mb-4">Metode Pembayaran</h3>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        selectedMethod === method.id ? 'bg-blue-600' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          selectedMethod === method.id ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">{method.name}</p>
                        {method.fee > 0 && (
                          <p className="text-xs text-gray-500">Fee {method.fee}%</p>
                        )}
                      </div>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {amount && selectedMethod && (
          <Card className="bg-gray-50 border-0">
            <CardContent className="pt-5 pb-5">
              <h3 className="font-semibold mb-4">Ringkasan</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah Deposit</span>
                  <span className="font-medium">Rp {parseInt(amount).toLocaleString()}</span>
                </div>
                {selectedPayment?.fee && selectedPayment.fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Admin ({selectedPayment.fee}%)</span>
                    <span className="font-medium">Rp {(parseInt(amount) * selectedPayment.fee / 100).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">Total Bayar</span>
                  <span className="font-bold text-lg">Rp {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-1">Informasi Penting</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Minimum deposit Rp 100.000</li>
                  <li>Saldo akan masuk otomatis setelah pembayaran berhasil</li>
                  <li>Proses verifikasi maksimal 5 menit</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <form onSubmit={handleDeposit}>
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={!amount || !selectedMethod || parseInt(amount) < 100000}
          >
            Lanjutkan ke Pembayaran
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </div>
    </Layout>
  )
}
