const testimonials = [
  {
    name: "Maria Santos",
    role: "17, Student — Newark",
    quote:
      "The health education program changed how I think about my body. I feel empowered, not scared. I'm making choices my family never taught me to make.",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    name: "James Williams",
    role: "Hospital Partner — St. Barnabas Medical Center",
    quote:
      "Cares4ME reaches students who need health literacy most. The impact is measurable — we're seeing fewer preventable ER visits in communities they serve.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    name: "Dr. Priya Patel",
    role: "Community Health Director",
    quote:
      "These aren't just programs — they're lifelines. We've seen real behavioral shifts in just three months. This is what preventive care looks like.",
    gradient: "from-emerald-500 to-teal-400",
  },
];

const stats = [
  { num: "847+", label: "Students Educated" },
  { num: "$127K", label: "Raised & Deployed" },
  { num: "18", label: "Health Programs" },
  { num: "100%", label: "Goes to Programs" },
];

const donationTiers = [
  { amount: "$5", impact: "1 hot meal for a senior", description: "Meals on Wheels USA", color: "from-blue-500/20 to-cyan-500/10" },
  { amount: "$10", impact: "1 week prenatal vitamins", description: "Women's Health Network USA", color: "from-pink-500/20 to-rose-500/10" },
  { amount: "$20", impact: "1 month after-school meals", description: "No Kid Hungry USA", color: "from-amber-500/20 to-orange-500/10" },
  { amount: "$50", impact: "1 month safe housing", description: "Domestic Violence Programs USA", color: "from-purple-500/20 to-indigo-500/10" },
  { amount: "$100", impact: "1 year student education", description: "India Education Program", color: "from-emerald-500/20 to-green-500/10", featured: true },
  { amount: "$125", impact: "1 day blind school care", description: "Blind School India", color: "from-sky-500/20 to-blue-500/10", featured: true },
  { amount: "Custom", impact: "Your choice of impact", description: "Flexible allocation", color: "from-slate-500/20 to-gray-500/10" },
];

const partners = [
  { name: "Feeding America", type: "Senior Care Network" },
  { name: "Meals on Wheels America", type: "Senior Nutrition" },
  { name: "No Kid Hungry", type: "Child Food Programs" },
  { name: "Women's Aid", type: "Domestic Violence Support" },
  { name: "St. Barnabas Medical Center", type: "Hospital Partner" },
  { name: "Blind School India", type: "Education & Care" },
];

const galleryCards = [
  { title: "Diabetes Prevention Workshop", color: "from-orange-500/40 to-red-600/40", city: "Newark" },
  { title: "Nutrition Education Bootcamp", color: "from-emerald-500/40 to-green-600/40", city: "Jersey City" },
  { title: "Mental Health Awareness", color: "from-purple-500/40 to-indigo-600/40", city: "Elizabeth" },
  { title: "Senior Care Training", color: "from-blue-500/40 to-cyan-600/40", city: "Paterson" },
  { title: "Youth Health Clinic", color: "from-yellow-500/40 to-amber-600/40", city: "Union City" },
  { title: "Community Health Fair", color: "from-rose-500/40 to-pink-600/40", city: "Bayonne" },
];

const volunteerRoles = [
  { icon: "👩‍⚕️", title: "Health Educator", desc: "Lead workshops in your community" },
  { icon: "🤝", title: "Mentor", desc: "Guide students 1-on-1" },
  { icon: "📚", title: "Curriculum Developer", desc: "Create health education content" },
  { icon: "🎯", title: "Program Coordinator", desc: "Manage local initiatives" },
];

export default function HealthHopePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-emerald-950">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-black bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] bg-clip-text text-transparent">
            Care4ME
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#stories" className="hover:text-white transition">Stories</a>
            <a href="#impact" className="hover:text-white transition">Impact</a>
            <a href="#donate-tiers" className="hover:text-white transition">Donate</a>
            <a href="#volunteer" className="hover:text-white transition">Volunteer</a>
          </div>
          <a
            href="#donate"
            className="bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] hover:from-[#8AC34A] hover:to-[#42A0DE] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Donate $100
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7CB342]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2BA5D7]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 mb-8 text-sm text-[#7CB342] font-medium">
            <span>✦</span>
            <span>100% of every donation funds health programs directly</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
            <span className="block bg-gradient-to-r from-white via-[#7CB342]/40 to-[#2BA5D7]/40 bg-clip-text text-transparent">
              Restoring Health.
            </span>
            <span className="block bg-gradient-to-r from-[#7CB342] via-[#2BA5D7] to-[#7CB342] bg-clip-text text-transparent">
              Renewing Hope.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
            One student, one senior, one life at a time.{" "}
            <span className="text-[#7CB342] font-semibold">$100 funds complete health restoration programs.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#donate-tiers"
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] hover:from-[#8AC34A] hover:to-[#42A0DE] text-white font-bold py-5 px-10 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              $100 = 1 Year Education
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                →
              </span>
            </a>
            <a
              href="#stories"
              className="inline-flex items-center justify-center border-2 border-white/30 hover:border-[#2BA5D7]/50 text-white/90 hover:text-white font-semibold py-5 px-10 rounded-2xl text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              See Impact Stories
            </a>
          </div>
        </div>
      </header>

      {/* ── STORYTELLING / TESTIMONIALS ── */}
      <section id="stories" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-[#7CB342] font-semibold uppercase tracking-widest text-sm mb-3">Real Stories</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Lives Changed,{" "}
              <span className="bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] bg-clip-text text-transparent">
                One Step at a Time
              </span>
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl">
              Hear from the students, hospital partners, and health directors whose lives are shaped by this program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ name, role, quote, gradient }, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#2BA5D7]/50 hover:bg-white/10 transition-all duration-500"
              >
                {/* Placeholder photo circle */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} mb-6 shadow-lg`} />
                <blockquote className="text-slate-200 leading-relaxed mb-6 italic">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-bold text-white">{name}</p>
                  <p className="text-sm text-[#2BA5D7]">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section id="impact" className="py-24 px-4 sm:px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#7CB342] font-semibold uppercase tracking-widest text-sm mb-3">Impact</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Numbers That{" "}
              <span className="bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] bg-clip-text text-transparent">
                Don&apos;t Lie
              </span>
            </h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">
              Zero overhead. Every dollar goes directly to health programs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ num, label }, i) => (
              <div
                key={i}
                className="group text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#2BA5D7]/50 hover:bg-white/10 transition-all duration-500 hover:scale-105"
              >
                <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] bg-clip-text text-transparent mb-2">
                  {num}
                </div>
                <div className="text-slate-300 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DONATION TIERS ── */}
      <section id="donate-tiers" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <p className="text-[#2BA5D7] font-semibold uppercase tracking-widest text-sm mb-3">Make Your Impact</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] bg-clip-text text-transparent">
                Level of Impact
              </span>
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Every donation goes directly to real people in need. See exactly what your gift provides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {donationTiers.slice(0, 4).map(({ amount, impact, description, color }, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} border-2 border-white/10 hover:border-[#2BA5D7]/50 p-8 transition-all duration-300 hover:scale-105 cursor-pointer`}
              >
                <div className="relative z-10">
                  <div className="text-3xl font-black text-white mb-2">{amount}</div>
                  <p className="text-sm font-semibold text-[#7CB342] mb-3">{impact}</p>
                  <p className="text-xs text-slate-300">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donationTiers.slice(4).map(({ amount, impact, description, color, featured }, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-2xl ${featured ? "lg:col-span-1" : ""} bg-gradient-to-br ${color} ${featured ? "ring-2 ring-[#2BA5D7]" : "border-2 border-white/10"} hover:border-[#2BA5D7]/50 p-8 transition-all duration-300 hover:scale-105 cursor-pointer`}
              >
                <div className="relative z-10">
                  <div className="text-3xl font-black text-white mb-2">{amount}</div>
                  <p className="text-sm font-semibold text-[#7CB342] mb-3">{impact}</p>
                  <p className="text-xs text-slate-300">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORPORATE PARTNERSHIP CTA ── */}
      <section id="partner" className="py-24 px-4 sm:px-6 bg-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/60 via-blue-950/60 to-slate-900/60 border border-white/15 p-10 sm:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7CB342]/10 via-transparent to-[#2BA5D7]/10 pointer-events-none" />

            <div className="relative z-10">
              <p className="text-[#2BA5D7] font-semibold uppercase tracking-widest text-sm mb-4">Our Partners</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                Where Your{" "}
                <span className="bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] bg-clip-text text-transparent">
                  Donation Goes
                </span>
              </h2>
              <p className="text-slate-200 text-lg leading-relaxed mb-10 max-w-2xl">
                We partner with trusted organizations serving seniors, women, children, and students in the USA and India.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {partners.map(({ name, type }, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[#7CB342] text-xl">✓</span>
                    <div>
                      <p className="font-bold text-white text-sm">{name}</p>
                      <p className="text-xs text-slate-400">{type}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#donate"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] hover:from-[#8AC34A] hover:to-[#42A0DE] text-white font-bold py-5 px-10 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Support Our Partners
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── VOLUNTEER OPPORTUNITIES ── */}
      <section id="volunteer" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <p className="text-[#2BA5D7] font-semibold uppercase tracking-widest text-sm mb-3">Join Us</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Volunteer{" "}
              <span className="bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] bg-clip-text text-transparent">
                Opportunities
              </span>
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Beyond donations — your time and expertise transform lives directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {volunteerRoles.map(({ icon, title, desc }, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#2BA5D7]/50 hover:bg-white/10 transition-all duration-500"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-300 text-sm mb-6">{desc}</p>
                <a href="#" className="text-[#2BA5D7] font-semibold text-sm hover:text-[#7CB342] transition">
                  Learn More →
                </a>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] hover:from-[#8AC34A] hover:to-[#42A0DE] text-white font-bold py-5 px-10 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Become a Volunteer
            </a>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY GALLERY ── */}
      <section id="programs" className="py-24 px-4 sm:px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-[#2BA5D7] font-semibold uppercase tracking-widest text-sm mb-3">Programs</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Health Education{" "}
              <span className="bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] bg-clip-text text-transparent">
                In Every Community
              </span>
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl">
              Six core programs serving communities. Real impact, real people — placeholders until real photos provided.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryCards.map(({ title, color, city }, i) => (
              <div
                key={i}
                className={`group relative h-72 rounded-3xl overflow-hidden bg-gradient-to-br ${color} border-2 border-white/10 hover:border-[#2BA5D7]/50 transition-all duration-700 hover:scale-105 hover:-rotate-1 cursor-pointer`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{title}</h3>
                  <p className="text-slate-300 text-sm">{city} · 2026</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer id="donate" className="py-24 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#7CB342] font-semibold uppercase tracking-widest text-sm mb-4">Support Our Mission</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            One Gift.{" "}
            <span className="bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] bg-clip-text text-transparent">
              One Life Changed.
            </span>
          </h2>
          <p className="text-slate-300 text-lg mb-2">
            Choose your level of impact from $5 to custom donations.
          </p>
          <p className="text-slate-400 mb-10">Dignity. Hope. Waste-Free. 100% transparent.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <a
              href="#donate-tiers"
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#7CB342] to-[#2BA5D7] hover:from-[#8AC34A] hover:to-[#42A0DE] text-white font-bold py-5 px-10 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              See All Donation Options
            </a>
            <a
              href="#volunteer"
              className="inline-flex items-center justify-center border-2 border-white/30 hover:border-[#2BA5D7]/50 text-white/90 hover:text-white font-semibold py-5 px-10 rounded-2xl text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              Volunteer Instead
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 mb-10">
            <span className="flex items-center gap-1.5"><span className="text-[#7CB342]">✓</span> 501(c)(3) Verified</span>
            <span className="flex items-center gap-1.5"><span className="text-[#7CB342]">✓</span> 100% Tax-Deductible</span>
            <span className="flex items-center gap-1.5"><span className="text-[#7CB342]">✓</span> Zero Overhead</span>
            <span className="flex items-center gap-1.5"><span className="text-[#7CB342]">✓</span> Secure Donation</span>
          </div>

          <p className="text-slate-500 text-sm">
            <span className="font-bold text-slate-400">Care4ME</span> · Restoring Health. Renewing Hope. ·{" "}
            <a href="https://caresforu.com" className="text-[#2BA5D7] hover:underline">caresforu.com</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
