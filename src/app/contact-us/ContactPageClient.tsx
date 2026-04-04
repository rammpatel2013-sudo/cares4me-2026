'use client';

import { AnimatedCard } from '../animations';
import { useState } from 'react';

type ContactUsContent = {
  hero: {
    title: string;
    description: string;
  };
  contactCards: Array<{
    icon: string;
    title: string;
    value: string;
    href: string;
  }>;
  form: {
    heading: string;
    successMessage: string;
    subjects: Array<{
      value: string;
      label: string;
    }>;
    buttonLabel: string;
  };
};

export default function ContactPageClient({ content }: { content: ContactUsContent }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: content.form.subjects[0]?.value || 'general',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: content.form.subjects[0]?.value || 'general',
      message: ''
    });
  };

  return (
    <main className="bg-white">
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">{content.hero.title}</h1>
          <p className="text-xl text-gray-700 max-w-2xl">{content.hero.description}</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {content.contactCards.map((card, idx) => (
            <AnimatedCard key={`${card.title}-${idx}`} delay={idx * 0.1}>
              <div className="bg-[#F5F5F5] p-8 rounded-xl text-center">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-[#1E5A96] mb-2">{card.title}</h3>
                <p className="text-gray-600">
                  {card.href ? (
                    <a href={card.href} className="hover:text-[#2BA5D7]">{card.value}</a>
                  ) : card.value}
                </p>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatedCard>
            <form onSubmit={handleSubmit} className="bg-[#F5F5F5] p-8 rounded-xl">
              <h2 className="text-2xl font-black text-[#1E5A96] mb-6">{content.form.heading}</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-[#7CB342] text-white rounded-lg">
                  {content.form.successMessage}
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
                    {content.form.subjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>{subject.label}</option>
                    ))}
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
                  {content.form.buttonLabel}
                </button>
              </div>
            </form>
          </AnimatedCard>
        </div>
      </section>
    </main>
  );
}
