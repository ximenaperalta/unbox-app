import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <span className="text-xl font-bold tracking-tight">UNBOX</span>
        <div className="flex gap-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">Home</Link>
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/core" className="hover:text-black">Core</Link>
          <Link href="/docs" className="hover:text-black">Docs</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Design the moment your customer opens the box.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          UNBOX is an AI tool that helps e-commerce brands and subscription box creators design an intentional, memorable unboxing experience.
        </p>
        <button className="bg-black text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-800">
          Get Started
        </button>
      </section>

      {/* What it does */}
      <section className="bg-gray-50 px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">What UNBOX does</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="font-semibold mb-2">Box & Materials</h3>
              <p className="text-sm text-gray-500">Get recommendations for box type, size, and materials that fit your brand and budget.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🎀</div>
              <h3 className="font-semibold mb-2">Presentation & Inserts</h3>
              <p className="text-sm text-gray-500">Design the product reveal, tissue paper, inserts, and thank-you cards.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="font-semibold mb-2">Brand Experience</h3>
              <p className="text-sm text-gray-500">Make sure every detail reinforces your brand identity from the outside in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="max-w-4xl mx-auto px-8 py-20">
        <h2 className="text-2xl font-bold text-center mb-12">Coming Soon</h2>
        <div className="space-y-4">
          {[
            { week: "Week 1", feature: "AI unboxing experience generator" },
            { week: "Week 2", feature: "Brand identity input and style matching" },
            { week: "Week 3", feature: "Saved results dashboard" },
            { week: "Week 4", feature: "Competitor unboxing analysis" },
            { week: "Week 5", feature: "Full packaging brief export" },
          ].map((item) => (
            <div key={item.week} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
              <span className="text-xs font-medium text-gray-400 w-16">{item.week}</span>
              <span className="text-sm text-gray-700">{item.feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-8 py-8 text-center text-sm text-gray-400">
        UNBOX · Negocios Inteligentes y Comercio Digital · AI-101. Ximena Peralta
      </footer>
    </div>
  );
}