import { useState } from 'react'
import Layout from '@/components/Layout'
import MobileHeader from '@/components/MobileHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Star, Download, FileText, AlertCircle } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const buyOrders = [
  { price: 49500, volume: 150 },
  { price: 49000, volume: 200 },
  { price: 48500, volume: 100 },
  { price: 48000, volume: 250 },
]

const sellOrders = [
  { price: 50500, volume: 120 },
  { price: 51000, volume: 180 },
  { price: 51500, volume: 90 },
  { price: 52000, volume: 200 },
]

const chartData = {
  '1D': [
    { time: '09:00', price: 48500 },
    { time: '11:00', price: 49000 },
    { time: '13:00', price: 49800 },
    { time: '15:00', price: 50000 },
  ],
  '1W': [
    { time: 'Sen', price: 46000 },
    { time: 'Sel', price: 47000 },
    { time: 'Rab', price: 47500 },
    { time: 'Kam', price: 48500 },
    { time: 'Jum', price: 50000 },
  ],
  '1M': [
    { time: 'W1', price: 42000 },
    { time: 'W2', price: 44000 },
    { time: 'W3', price: 46000 },
    { time: 'W4', price: 50000 },
  ],
  '3M': [
    { time: 'Jan', price: 38000 },
    { time: 'Feb', price: 42000 },
    { time: 'Mar', price: 45000 },
    { time: 'Apr', price: 50000 },
  ],
  '1Y': [
    { time: 'Apr', price: 30000 },
    { time: 'Jun', price: 32000 },
    { time: 'Agu', price: 35000 },
    { time: 'Okt', price: 40000 },
    { time: 'Des', price: 45000 },
    { time: 'Feb', price: 48000 },
    { time: 'Apr', price: 50000 },
  ],
}

export default function OrderbookPage() {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [shares, setShares] = useState('')
  const [price, setPrice] = useState('')
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1W')
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Order ${orderType} berhasil: ${shares} saham @ Rp ${price}`)
    setSheetOpen(false)
  }

  const currentData = chartData[timeframe]
  const priceChange = currentData[currentData.length - 1].price - currentData[0].price
  const priceChangePercent = ((priceChange / currentData[0].price) * 100).toFixed(2)

  return (
    <Layout role="investor">
      <MobileHeader title="Warung Makan Sederhana" showBack />
      
      <div className="pb-20">
        {/* Header Info */}
        <div className="px-4 py-4 bg-white border-b">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">F&B</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">4.5</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold">Rp 50.000</h2>
            </div>
            <Badge className={`${
              priceChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            } border-0 text-base px-3 py-1`}>
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {priceChange >= 0 ? '+' : ''}{priceChangePercent}%
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">High</p>
              <p className="font-semibold">52k</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Low</p>
              <p className="font-semibold">47.5k</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Volume</p>
              <p className="font-semibold">1.250</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 py-4 bg-white">
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className="flex-shrink-0 h-8 text-xs"
              >
                {tf}
              </Button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={currentData}>
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                hide
              />
              <Tooltip 
                formatter={(value) => [`Rp ${Number(value).toLocaleString()}`, 'Harga']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={priceChange >= 0 ? '#16a34a' : '#dc2626'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orderbook */}
        <div className="px-4 py-4 space-y-4">
          <Tabs defaultValue="chart">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="orderbook">Orderbook</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="mt-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="grid grid-cols-3 gap-3 text-center text-sm mb-4">
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">High</p>
                      <p className="font-semibold">52k</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Low</p>
                      <p className="font-semibold">47.5k</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Volume</p>
                      <p className="font-semibold">1.250</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orderbook" className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Buy Orders */}
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <h3 className="text-sm font-semibold text-green-600 mb-3">Buy</h3>
                    <div className="space-y-2">
                      {buyOrders.map((order, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="font-medium text-green-600">
                            {(order.price / 1000).toFixed(1)}k
                          </span>
                          <span className="text-gray-600">{order.volume}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sell Orders */}
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <h3 className="text-sm font-semibold text-red-600 mb-3">Sell</h3>
                    <div className="space-y-2">
                      {sellOrders.map((order, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="font-medium text-red-600">
                            {(order.price / 1000).toFixed(1)}k
                          </span>
                          <span className="text-gray-600">{order.volume}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="info" className="mt-4 space-y-4">
              {/* Business Info */}
              <Card>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-semibold mb-4">Tentang Usaha</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Warung makan yang menyediakan berbagai menu masakan Indonesia dengan harga terjangkau. Sudah berdiri sejak 2020 dan memiliki pelanggan tetap yang loyal. Lokasi strategis di area perkantoran dengan traffic tinggi.
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Kategori</span>
                      <span className="font-medium">Food & Beverage</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Alamat</span>
                      <span className="font-medium text-right">Jl. Raya Bogor No. 123, Jakarta Timur</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Tahun Berdiri</span>
                      <span className="font-medium">2020</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Karyawan</span>
                      <span className="font-medium">12 Orang</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Info */}
              <Card>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-semibold mb-4">Informasi Keuangan</h3>
                  <div className="grid grid-cols-2 gap-3">
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
                      <p className="text-xs text-gray-500 mb-1">Margin Laba</p>
                      <p className="text-lg font-bold text-blue-600">20%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Info */}
              <Card>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-semibold mb-4">Informasi Saham</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Total Saham</span>
                      <span className="font-medium">10.000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Saham Beredar</span>
                      <span className="font-medium">5.200 (52%)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Market Cap</span>
                      <span className="font-medium">Rp 500jt</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Total Investor</span>
                      <span className="font-medium">248</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-semibold mb-4">Dokumen & Laporan</h3>
                  <p className="text-xs text-gray-600 mb-4">
                    Download dokumen untuk analisa investasi Anda
                  </p>
                  <div className="space-y-3">
                    {[
                      { name: 'Izin Usaha (SIUP/NIB)', file: 'siup.pdf', size: '2.4 MB', icon: FileText },
                      { name: 'Laporan Keuangan 2025', file: 'laporan-keuangan-2025.pdf', size: '1.8 MB', icon: FileText },
                      { name: 'Laporan Keuangan 2024', file: 'laporan-keuangan-2024.pdf', size: '1.6 MB', icon: FileText },
                      { name: 'NPWP & SPT', file: 'npwp-spt.pdf', size: '1.2 MB', icon: FileText },
                    ].map((doc) => (
                      <Card key={doc.name} className="bg-gray-50 border-gray-200">
                        <CardContent className="pt-3 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <doc.icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.size}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="flex-shrink-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-yellow-800">
                      <p className="font-semibold mb-1">Disclaimer</p>
                      <p>Dokumen ini disediakan untuk keperluan analisa investasi. Pastikan Anda membaca dan memahami semua informasi sebelum berinvestasi.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 z-40">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-full h-12 text-base font-semibold">
              Trade Sekarang
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader className="mb-6">
              <SheetTitle>Buat Order</SheetTitle>
              <SheetDescription>Warung Makan Sederhana</SheetDescription>
            </SheetHeader>
            <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'buy' | 'sell')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="buy">Beli</TabsTrigger>
                <TabsTrigger value="sell">Jual</TabsTrigger>
              </TabsList>
              <TabsContent value={orderType}>
                <form onSubmit={handleSubmitOrder} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-base">Harga per Saham</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="50000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shares" className="text-base">Jumlah Saham</Label>
                    <Input
                      id="shares"
                      type="number"
                      placeholder="100"
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  {price && shares && (
                    <Card className="bg-gray-50 border-0">
                      <CardContent className="pt-4 pb-4">
                        <p className="text-sm text-gray-600 mb-1">Total</p>
                        <p className="text-2xl font-bold">
                          Rp {(parseInt(price) * parseInt(shares)).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  <Button type="submit" className="w-full h-12 text-base font-semibold">
                    {orderType === 'buy' ? 'Beli Saham' : 'Jual Saham'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  )
}
