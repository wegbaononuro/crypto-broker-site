
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CryptoBrokerSite() {
  const [prices, setPrices] = useState({ USDT: null, BTC: null, ETH: null });
  const [formData, setFormData] = useState({
    type: "buy",
    currency: "USDT",
    amount: "",
    wallet: "",
    bank: "",
    contact: ""
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/price");
        const data = await res.json();
        const getPrice = (symbol) => {
          const pair = data.find((item) => item.symbol === symbol);
          return pair ? parseFloat(pair.price) : null;
        };
        setPrices({
          USDT: getPrice("USDTBUSD"),
          BTC: getPrice("BTCUSDT"),
          ETH: getPrice("ETHUSDT")
        });
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order Submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Crypto Broker</h1>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Live Rates (with 2% margin)</h2>
          <ul className="space-y-1">
            <li>USDT: ₦{prices.USDT ? (prices.USDT * 1560 * 1.02).toFixed(2) : "Loading..."}</li>
            <li>BTC: ₦{prices.BTC ? (prices.BTC * 1560 * 1.02).toFixed(2) : "Loading..."}</li>
            <li>ETH: ₦{prices.ETH ? (prices.ETH * 1560 * 1.02).toFixed(2) : "Loading..."}</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Order Form</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label>Buy/Sell</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div>
              <label>Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="USDT">USDT</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>

            <div>
              <label>Amount (₦)</label>
              <input name="amount" type="number" value={formData.amount} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>

            <div>
              <label>Wallet Address (for Buy)</label>
              <input name="wallet" value={formData.wallet} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>

            <div>
              <label>Bank Details (for Sell)</label>
              <input name="bank" value={formData.bank} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>

            <div>
              <label>Email or WhatsApp</label>
              <input name="contact" value={formData.contact} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>

            <Button type="submit" className="w-full">Submit Order</Button>
          </form>
          {submitted && <p className="text-green-600 mt-3">Order submitted! We'll contact you shortly.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
