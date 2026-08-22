export default function Docs() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <span className="text-xl font-bold tracking-tight">UNBOX</span>
        <div className="flex gap-8 text-sm text-gray-600">
          <a href="/" className="hover:text-black">Home</a>
          <a href="/about" className="hover:text-black">About</a>
          <a href="/docs" className="hover:text-black">Docs</a>
        </div>
      </nav>
      <section className="max-w-4xl mx-auto px-8 py-24 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Docs</h1>
        <p className="text-gray-500 text-lg">Documentation coming soon.</p>
      </section>
    </div>
  );
}