export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-indigo-950">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Cares4ME
            </h1>
            <div className="space-x-4">
              <a href="#mission" className="text-slate-300 hover:text-white transition">Mission</a>
              <a href="#impact" className="text-slate-300 hover:text-white transition">Impact</a>
              <a href="#donate" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                Donate
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-8 leading-tight">
                Transforming Lives
              </h1>
              <p className="text-xl lg:text-2xl text-slate-200 mb-8 max-w-lg leading-relaxed opacity-90">
                Health & finance education for underserved students. 
                <span className="text-blue-300"> Real impact, real change.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#donate" className="group bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold py-5 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-500 inline-flex items-center">
                  Donate $25 Today
                  <span className="ml-3 w-5 h-5 bg-white rounded-full flex items-center justify-center font-bold text-emerald-600 group-hover:scale-110 transition-transform">→</span>
                </a>
                <a href="#stories" className="border-2 border-white/30 hover:border-white/50 text-white/90 hover:text-white font-semibold py-5 px-8 rounded-2xl text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  See Stories
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-emerald-400/20 via-blue-500/20 to-indigo-600/20 rounded-3xl border-2 border-white/20 backdrop-blur-xl shadow-2xl animate-pulse" />
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl blur-xl animate-pulse delay-1000" />
            </div>
          </div>

          {/* Impact Stats */}
          <div id="impact" className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
            {[
              { num: "500+", label: "Students", icon: "👥" },
              { num: "$25K", label: "Raised", icon: "💰" },
              { num: "12", label: "Communities", icon: "🌍" },
              { num: "100%", label: "Impact", icon: "⭐" }
            ].map(({ num, label, icon }, i) => (
              <div key={i} className="group text-center p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
                <div className="text-3xl lg:text-4xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors">{num}</div>
                <div className="text-slate-300 text-lg">{label}</div>
              </div>
            ))}
          </div>

          {/* Photo Gallery */}
          <section className="mb-24">
            <h2 className="text-4xl font-bold text-center text-white mb-16 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Real Stories, Real Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Health Workshop", subtitle: "Jersey City", color: "from-emerald-500" },
                { title: "Finance Bootcamp", subtitle: "Newark", color: "from-blue-500" },
                { title: "Community Outreach", subtitle: "Elizabeth", color: "from-purple-500" },
                { title: "Student Leadership", subtitle: "Union City", color: "from-orange-500" },
                { title: "Medical Training", subtitle: "Paterson", color: "from-rose-500" },
                { title: "Youth Mentorship", subtitle: "Bayonne", color: "from-indigo-500" }
              ].map(({ title, subtitle, color }, i) => (
                <div key={i} className="group relative h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-transparent border-2 border-white/10 hover:border-emerald-400/50 transition-all duration-700 hover:scale-105 hover:-rotate-1">
                  <div className={`absolute inset-0 bg-gradient-to-br ${color}/10 group-hover:${color}/20 transition-all duration-700`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-2">{title}</h3>
                    <p className="text-slate-300 text-lg drop-shadow-md">{subtitle} • 2026</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}