'use client'
import Link from "next/link";

export default function EAPage() {

  const handlePay = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-md p-8 space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            AI Trading EA
          </h1>
          <p className="text-slate-600 mt-2">
            Automated trading solution powered by AI.
          </p>
        </div>

        {/* Description */}
        <section className="space-y-3 text-slate-700 leading-relaxed">
          <p>
            Our EA (Expert Advisor) is an AI-based trading automation tool
            designed to help users execute trades efficiently.
          </p>

          <p>
            The EA currently supports the following currency pairs:
          </p>

          <ul className="list-disc pl-6">
            <li><strong>XAUUSD</strong></li>
            <li><strong>EURUSD</strong></li>
          </ul>

          <p>
            Recommended timeframe: <strong>1H (1 Hour)</strong>
          </p>

          <p>
            Users only need to select:
          </p>

          <ul className="list-disc pl-6">
            <li>Trading platform</li>
            <li>Currency pair</li>
          </ul>

          <p>
            Then download and install our EA on their trading machine.
          </p>
        </section>

        {/* Billing */}
        <section className="bg-green-50 border border-green-100 rounded-xl p-5">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Pricing & Commission
          </h2>

          <p className="text-slate-700">
            We charge weekly and only collect fees when the user makes a profit.
          </p>

          <ul className="list-disc pl-6 mt-2 text-slate-700">
            <li>Billing cycle: Weekly</li>
            <li>Charge only on profitable weeks</li>
            <li>Commission: <strong>10%</strong> of profit</li>
          </ul>
        </section>

        {/* Button */}
        <div className="pt-2">
          <Link
            href="/home"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition"
            style={{
                                      backgroundColor: '#f0fdf4', // สี bg-green-50
                                      borderColor: '#bbf7d0',     // สี border-green-200
                                      color: '#16a34a'            // สี text-green-600
                                    }}
          >
            Go to Home
          </Link>
           <button
        onClick={handlePay}
        className="bg-purple-600 px-6 py-3 rounded-xl"
         style={{
                                      backgroundColor: '#f0fdf4', // สี bg-green-50
                                      borderColor: '#bbf7d0',     // สี border-green-200
                                      color: '#16a34a'            // สี text-green-600
                                    }}
          
      >
        ปุ่มทดสอบ จ่ายเงินจริง 30 บาท
      </button>
        </div>
                                     <div className="flex min-h-screen items-center justify-center">
     
    </div>
      </div>
    </main>
  );
}
