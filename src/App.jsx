import { useState } from 'react'
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"

export default function App() {
  const [amount, setAmount] = useState("")
  const [wallet, setWallet] = useState("")
  const [bank, setBank] = useState("")
  const [contact, setContact] = useState("")
  const [currency, setCurrency] = useState("USDT")

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-6">
          <h1 className="text-2xl font-bold text-center">Crypto Broker</h1>
          <p className="text-center text-sm text-gray-500">
            Live Rates (with 2% margin)
          </p>

          <ul className="text-center text-sm text-gray-700 space-y-1">
            <li>USDT: ₦Loading…</li>
            <li>BTC: ₦166776567.98</li>
            <li>ETH: ₦3958332.77</li>
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

            <Input
              placeholder="Amount (₦)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              placeholder="Wallet Address (for Buy)"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
            />
            <Input
              placeholder="Bank Details (for Sell)"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            />
            <Input
              placeholder="Email or WhatsApp"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <Button className="w-full">Submit Order</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
