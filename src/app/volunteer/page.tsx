'use client';

import { useState } from 'react';

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    phone: '',
    why: '',
  });

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Health Educator",
      quote: "I've helped 50+ seniors learn about managing chronic diseases. Seeing their confidence grow is the best reward.",
      years: "2 years",
    },
    {
      name: "Michael Chen",
      role: "Mentor",
      quote: "Working with young students on health literacy has changed my perspective on what education truly means.",
      years: "1.5 years",
    },
    {
      name: "Priya Desai",
      role: "Curriculum Developer",
      quote: "Creating health materials that resonate with real communities is fulfilling beyond measure.",
      years: "1 year",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ role: '', name: '', email: '', phone: '', why: '' });
    }, 3000);
  };

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Join Our Movement</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Volunteer with Care4ME and transform lives directly. Your time and expertise matter.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-[#1E5A96] mb-12">Apply to Volunteer</h2>
          
          {submitted && (
            <div className="bg-[#7CB342] text-white p-6 rounded-xl mb-8 text-center">
              <p className="text-lg font-bold">Thank you! Your application has been received. We'll contact you soon!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#1E5A96] mb-3">What role are you interested in?</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BA5D7]"
                required
              >
                <option value="">Select a role...</option>
                <option value="Health Educator">Health Educator</option>
                <option value="Mentor">Mentor</option>
                <option value="Curriculum Developer">Curriculum Developer</option>
                <option value="Program Coordinator">Program Coordinator</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1E5A96] mb-3">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BA5D7]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1E5A96] mb-3">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BA5D7]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1E5A96] mb-3">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BA5D7]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1E5A96] mb-3">Why do you want to volunteer?</label>
              <textarea
                value={formData.why}
                onChange={(e) => setFormData({ ...formData, why: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BA5D7] h-32 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#7CB342] text-white font-bold py-4 rounded-lg hover:bg-[#6BA032] transition text-lg"
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-[#1E5A96] mb-12 text-center">From Our Volunteers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-[#F5F5F5] p-8 rounded-xl">
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-bold text-[#1E5A96]">{testimonial.name}</p>
                  <p className="text-sm text-[#7CB342] font-bold">{testimonial.role}</p>
                  <p className="text-xs text-gray-600">Volunteering for {testimonial.years}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}