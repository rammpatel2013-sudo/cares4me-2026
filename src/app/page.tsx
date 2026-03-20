export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <div className="container mx-auto px-4 py-24">
        {/* Hero Bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          <div className="md:col-span-7 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
              Cares4ME
            </h1>
            <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
              Health & finance education transforming student lives, one community at a time.
            </p>
          </div>
          <div className="md:col-span-5 grid grid-rows-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl p-6 backdrop-blur-xl border border-blue-500/30">
              <h3 className="text-2xl font-bold text-white mb-2">Our Impact</h3>
              <div className="space-y-2 text-slate-300">
                <div>📸 500+ students reached</div>
                <div>💰 $15K in micro-grants</div>
                <div>🌱 12 communities served</div>
              </div>
            </div>
            <a href="#donate" className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-6 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-2xl border-2 border-white/20 backdrop-blur-sm">
              Donate Now
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        {/* Photo Gallery Bento */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.02]">
              <div className="w-full h-64 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 animate-pulse group-hover:animate-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">Student Health Workshop</h3>
                <p className="text-slate-300 text-sm mt-1">Jersey City Campus • March 2026</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}