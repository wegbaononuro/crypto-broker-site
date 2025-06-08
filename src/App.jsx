import { useEffect, useState } from 'react'
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"

export default function App() {
  const [amount, setAmount] = useState("")
  const [wallet, setWallet] = useState("")
  const [bank, setBank] = useState("")
  const [contact, setContact] = useState("")
  const [currency, setCurrency] = useState("USDT")

  const [rates, setRates] = useState({
    USDT: null,
    BTC: null,
    ETH: null,
  })

  useEffect(() => {
    async function fetchRates() {
      try {
        // 1. Fetch USD->NGN from CoinGecko
        const ngnRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=ngn")
        const ngnData = await ngnRes.json()
        const usdToNgn = ngnData.tether.ngn

        // 2. Fetch BTC & ETH in USDT from Binance
        const btcRes = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")
        const ethRes = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT")
        const btc = await btcRes.json()
        const eth = await ethRes.json()

        const margin = 1.02 // 2% profit

        setRates({
          USDT: (usdToNgn * margin).toFixed(2),
          BTC: (parseFloat(btc.price) * usdToNgn * margin).toFixed(2),
          ETH: (parseFloat(eth.price) * usdToNgn * margin).toFixed(2),
        })
      } catch (err) {
        console.error("Rate fetch error", err)
      }
    }

    fetchRates()
    const interval = setInterval(fetchRates, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async () => {
    const formData = {
      currency,
      amount,
      wallet,
      bank,
      contact,
      timestamp: new Date().toISOString()
    }

    try {
      await fetch("https://script.google.com/macros/s/AKfycbxBd_VV5qyLh3iHEGDV8lV7p3u-ou1w6BPgRga-90ZLnpPlBvnFOMnxptiGyoiL_mpU/exec", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json"
        }
      })
      alert("Order submitted successfully!")
      setAmount("")
      setWallet("")
      setBank("")
      setContact("")
    } catch (error) {
      alert("Error submitting order")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-6">
          <h1 className="text-2xl font-bold text-center">Crypto Broker</h1>
          <p className="text-center text-sm text-gray-500">Live Rates (with 2% margin)</p>

          <ul className="text-center text-sm text-gray-700 space-y-1">
            <li>USDT: ₦{rates.USDT || 'Loading…'}</li>
            <li>BTC: ₦{rates.BTC || 'Loading…'}</li>
            <li>ETH: ₦{rates.ETH || 'Loading…'}</li>
          </ul>

          <div className="space-y-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>

            <Input placeholder="Amount (₦)" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Input placeholder="Wallet Address (for Buy)" value={wallet} onChange={(e) => setWallet(e.target.value)} />
            <Input placeholder="Bank Details (for Sell)" value={bank} onChange={(e) => setBank(e.target.value)} />
            <Input placeholder="Email or WhatsApp" value={contact} onChange={(e) => setContact(e.target.value)} />
            <Button className="w-full" onClick={handleSubmit}>Submit Order</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
