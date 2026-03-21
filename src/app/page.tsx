export default function HomePage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#F5F5F5] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6 leading-tight">
                Restoring Health, Renewing Hope
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                One step at a time. We're transforming lives through health restoration and community care. From education in India to seniors in the USA, every donation creates real, measurable impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/donate"
                  className="bg-[#2BA5D7] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#1E5A96] transition text-center"
                >
                  Donate Now
                </a>
                <a
                  href="/volunteer"
                  className="border-2 border-[#7CB342] text-[#7CB342] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#7CB342] hover:text-white transition text-center"
                >
                  Volunteer
                </a>
              </div>
            </div>
            <div className="bg-[#E8F4F8] rounded-2xl p-12 h-96 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#2BA5D7] text-sm font-bold uppercase mb-2">Our Mission</p>
                <p className="text-2xl font-bold text-[#1E5A96]">
                  100% of donations fund health programs directly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-[#2BA5D7] mb-2">847+</div>
              <p className="text-gray-700 font-medium">Students Educated</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#7CB342] mb-2">$127K</div>
              <p className="text-gray-700 font-medium">Raised & Deployed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#1E5A96] mb-2">18</div>
              <p className="text-gray-700 font-medium">Active Programs</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#2BA5D7] mb-2">100%</div>
              <p className="text-gray-700 font-medium">To Programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border-l-4 border-[#7CB342]">
              <div className="text-3xl font-black text-[#7CB342] mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You Donate</h3>
              <p className="text-gray-600">Choose your donation amount — every level creates real impact.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border-l-4 border-[#2BA5D7]">
              <div className="text-3xl font-black text-[#2BA5D7] mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">We Allocate</h3>
              <p className="text-gray-600">Your donation goes directly to programs — no overhead.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border-l-4 border-[#1E5A96]">
              <div className="text-3xl font-black text-[#1E5A96] mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lives Change</h3>
              <p className="text-gray-600">Seniors get meals, students get education, health is restored.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaign */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-[#1E5A96] mb-12">Featured Campaign</h2>
          <div className="bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8] rounded-2xl p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-96 bg-[#D0E8F2] rounded-xl flex items-center justify-center">
              <p className="text-gray-500 text-center">Campaign Photo Placeholder</p>
            </div>
            <div>
              <p className="text-[#2BA5D7] font-bold uppercase mb-2">Campaign Highlight</p>
              <h3 className="text-3xl font-black text-[#1E5A96] mb-4">Student Education Program</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                $100 funds one student's complete education for a full year in India. This includes tuition, books, meals, and health supplies. Every donation transforms a life.
              </p>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-900">Progress</span>
                  <span className="text-gray-600">$50,000 of $75,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-[#7CB342] h-3 rounded-full" style={{ width: "67%" }}></div>
                </div>
              </div>
              <a
                href="/campaigns"
                className="bg-[#7CB342] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#6BA032] transition inline-block"
              >
                View All Campaigns
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Choose to donate, volunteer, or partner with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="bg-[#7CB342] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#6BA032] transition"
            >
              Donate
            </a>
            <a
              href="/volunteer"
              className="bg-[#2BA5D7] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#1E89B6] transition"
            >
              Volunteer
            </a>
            <a
              href="/partners"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1E5A96] transition"
            >
              Partner
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}