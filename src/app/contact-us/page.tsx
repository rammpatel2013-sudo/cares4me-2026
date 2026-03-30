'use client';

import { AnimatedCard } from '../animations';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' });
  };

  return (
    <main className="bg-white">
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Contact Us</h1>
          <p className="text-xl text-gray-700 max-w-2xl">Get in touch with our team. We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <AnimatedCard>
            <div className="bg-[#F5F5F5] p-8 rounded-xl text-center">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="font-bold text-[#1E5A96] mb-2">Email</h3>
              <p className="text-gray-600"><a href="mailto:cae4medicalequipment@gmail.com" className="hover:text-[#2BA5D7]">care4medicalequipment@gmail.com</a></p>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={0.1}>
            <div className="bg-[#F5F5F5] p-8 rounded-xl text-center">
              <div className="text-3xl mb-4">📞</div>
              <h3 className="font-bold text-[#1E5A96] mb-2">Phone</h3>
              <p className="text-gray-600"><a href="tel:6093674603" className="hover:text-[#2BA5D7]">(609) 367-4603</a></p>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={0.2}>
            <div className="bg-[#F5F5F5] p-8 rounded-xl text-center">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="font-bold text-[#1E5A96] mb-2">Location</h3>
              <p className="text-gray-600">New Jersey, USA</p>
            </div>
          </AnimatedCard>
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatedCard>
            <form onSubmit={handleSubmit} className="bg-[#F5F5F5] p-8 rounded-xl">
              <h2 className="text-2xl font-black text-[#1E5A96] mb-6">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-[#7CB342] text-white rounded-lg">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#1E5A96] mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2BA5D7]"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#1E5A96] mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2BA5D7]"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1E5A96] mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2BA5D7]"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1E5A96] mb-2">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2BA5D7]"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="donation">Donation Question</option>
                    <option value="volunteer">Volunteer Opportunity</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1E5A96] mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2BA5D7]"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2BA5D7] text-white py-3 rounded-lg font-bold hover:bg-[#1E5A96] transition"
                >
                  Send Message
                </button>
              </div>
            </form>
          </AnimatedCard>
        </div>
      </section>
    </main>
  );
}