import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <span className="text-xl font-bold tracking-tight">UNBOX</span>
        <div className="flex gap-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">Home</Link>
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/core" className="hover:text-black">Core</Link>
          <Link href="/docs" className="hover:text-black">Docs</Link>
        </div>
      </nav>
      <section className="max-w-4xl mx-auto px-8 py-24 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About UNBOX</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          UNBOX is a student-built AI tool that helps e-commerce brands and subscription box creators design intentional, memorable unboxing experiences.
        </p>
      </section>
    </div>
  );
}