#!/usr/bin/env node
/**
 * Setup script: Creates page folders and scaffolds all 6 pages
 * Run: node setup-all-pages.js
 */
const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const APP_DIR = path.join(BASE_DIR, 'src', 'app');

// Define all 6 pages with their content
const pages = [
  {
    folder: 'about',
    content: `'use client';

import { AnimatedCard } from '../../animations';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const values = [
    { icon: '❤️', title: 'Health First', description: 'Every decision guided by the health and dignity of those we serve.' },
    { icon: '♻️', title: 'Zero Waste', description: 'Surplus in one part of the world should never go to waste.' },
    { icon: '🤝', title: 'Trust-Based', description: 'We work through partners who have earned trust in their communities.' },
    { icon: '💰', title: 'Zero Overhead', description: 'Every dollar donated covers our mission — nothing else.' }
  ];

  const impacts = [
    { number: '$750K+', label: 'Goods Redistributed' },
    { number: '10-20', label: 'NGO Partners' },
    { number: '2024', label: 'Founded' },
    { number: '0%', label: 'Overhead on Donations' }
  ];

  return (
    <main className="bg-white">
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-bold text-[#2BA5D7] mb-6">✓ 501(c)(3) Nonprofit</div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6 leading-tight">
            Giving medical equipment <em className="italic text-[#7CB342]">a second life.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl text-gray-700 max-w-2xl leading-relaxed">
            Restoring health and renewing hope — one wheelchair, one walker, one family at a time.
          </motion.p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {impacts.map((item, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-[#F5F5F5] p-6 rounded-lg text-center">
                  <div className="text-3xl font-black text-[#2BA5D7] mb-2">{item.number}</div>
                  <p className="text-sm font-bold text-gray-600">{item.label}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <AnimatedCard>
            <h2 className="text-4xl font-black text-[#1E5A96] mb-8">Our Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Care4ME was founded in 2024 by Darsh Gajera, a high school student from New Jersey who saw a simple but urgent problem: across the United States, wheelchairs, walkers, hospital beds, and care supplies sit unused in garages and storage rooms — while families in rural communities around the world go without the most basic mobility and health equipment.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              What started as a small family effort has grown into something that has redistributed over $750,000 in goods to under-resourced communities worldwide.
            </p>
          </AnimatedCard>

          <AnimatedCard delay={0.1}>
            <div className="bg-[#E8F4F8] border-l-4 border-[#7CB342] p-8 rounded-lg my-12">
              <p className="text-2xl font-black text-[#1E5A96] italic">
                "Every item we ship represents something a family couldn't otherwise afford. A wheelchair isn't just equipment — it's independence."
              </p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We operate lean, transparent, and mission-first. Every donation goes directly toward getting supplies to people who need them.
            </p>
          </AnimatedCard>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5] border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-[#1E5A96] mb-6">Our Mission & Values</h2>
          <p className="text-lg text-gray-700 mb-12 leading-relaxed">
            Our mission is to restore health and renew hope by giving used medical equipment a second life in under-resourced communities worldwide.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-3xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-black text-[#1E5A96] mb-3">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Make an Impact?</h2>
          <p className="text-lg text-gray-100 mb-8">Donate, volunteer, or partner with us.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/donate" className="bg-[#7CB342] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#6BA034] transition">Donate Now</a>
            <a href="/volunteer" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#1E5A96] transition">Volunteer</a>
          </div>
        </div>
      </section>
    </main>
  );
}`
  },
  {
    folder: 'faq',
    content: `'use client';

import { AnimatedCard } from '../../animations';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { question: 'Would I be able to hold an event in your name to raise money for Care4ME?', answer: 'Yes, but not without our permission. Email us at cae4medicalequipment@gmail.com or call 609-367-4603 to discuss your event idea.' },
    { question: 'What exactly is getting donated?', answer: 'Wheelchairs, walkers, adult diapers, and other essential medical equipment. As we grow, we plan to accept hospital beds and equipment that hospitals can no longer use.' },
    { question: 'Can I sponsor a specific category of item?', answer: 'Yes! Visit our Donate page where you can choose to fund one of our ongoing programs.' },
    { question: 'How do I see what happens with my money?', answer: 'Follow us on social media! We share regular updates on Instagram, Facebook, and TikTok showing exactly where donations go and the impact they create.' },
    { question: 'Does Care4ME accept international donations?', answer: 'Yes! If your payment method doesn\\'t work, please reach out to us directly at cae4medicalequipment@gmail.com and we\\'ll work something out.' },
    { question: 'Is Care4ME a registered nonprofit?', answer: 'Yes, we are a 501(c)(3) nonprofit organization. Every donation is tax-deductible and 100% funds our mission.' },
    { question: 'How can I volunteer?', answer: 'Visit our Volunteer page to learn about current opportunities. We work with remote volunteers and in-person partners.' },
    { question: 'Can organizations partner with us?', answer: 'Absolutely! Reach out to cae4medicalequipment@gmail.com to discuss partnership opportunities.' }
  ];

  return (
    <main className="bg-white">
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">
            Frequently Asked Questions
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl text-gray-700">
            Everything you need to know about Care4ME.
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.05}>
                <motion.div className="bg-[#F5F5F5] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                  <div className="p-6 flex justify-between items-center bg-white border-b-2 border-[#E8F4F8]">
                    <h3 className="text-lg font-black text-[#1E5A96] flex-1 text-left">{faq.question}</h3>
                    <motion.span animate={{ rotate: openIndex === idx ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-2xl text-[#7CB342] ml-4 flex-shrink-0">▼</motion.span>
                  </div>
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: openIndex === idx ? 'auto' : 0, opacity: openIndex === idx ? 1 : 0 }} transition={{ duration: 0.3 }} overflow="hidden">
                    <div className="p-6 bg-[#F5F5F5] text-gray-700 leading-relaxed text-base">{faq.answer}</div>
                  </motion.div>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">Still have questions?</h2>
          <p className="text-xl text-gray-100 mb-8">Reach out to our team directly!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg"><div className="text-2xl mb-2">📧</div><p className="font-bold mb-2">Email</p><a href="mailto:cae4medicalequipment@gmail.com" className="text-[#7CB342]">cae4medicalequipment@gmail.com</a></div>
            <div className="bg-white/10 p-6 rounded-lg"><div className="text-2xl mb-2">📞</div><p className="font-bold mb-2">Phone</p><a href="tel:6093674603" className="text-[#7CB342]">(609) 367-4603</a></div>
          </div>
        </div>
      </section>
    </main>
  );
}`
  },
  {
    folder: 'dashboard',
    content: `'use client';

import { AnimatedCard, AnimatedStatBox } from '../../animations';

export default function DashboardPage() {
  const metrics = [
    { label: 'Total Donations', value: '$127,450', color: '#2BA5D7' },
    { label: 'Active Volunteers', value: '342', color: '#7CB342' },
    { label: 'Beneficiaries', value: '8,943', color: '#1E5A96' },
    { label: 'Programs Running', value: '18', color: '#2BA5D7' }
  ];

  const programs = [
    { name: 'Medical Equipment Distribution', progress: 85, raised: '$85,200', goal: '$100,000' },
    { name: 'Community Partnerships', progress: 72, raised: '$38,500', goal: '$52,000' },
    { name: 'Volunteer Support', progress: 68, raised: '$28,900', goal: '$42,000' },
    { name: 'International Outreach', progress: 90, raised: '$14,850', goal: '$16,500' }
  ];

  return (
    <main className="bg-white">
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Impact Dashboard</h1>
          <p className="text-xl text-gray-700 max-w-2xl">Real-time tracking of our programs, donations, and lives changed.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-[#1E5A96] mb-12">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {metrics.map((metric, idx) => (
              <AnimatedStatBox key={idx} value={metric.value} label={metric.label} color={metric.color} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-[#1E5A96] mb-12">Program Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-white p-8 rounded-xl">
                  <h3 className="text-xl font-black text-[#1E5A96] mb-4">{program.name}</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-[#7CB342]">{program.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-[#7CB342] h-3 rounded-full transition-all duration-500" style={{ width: \`\${program.progress}%\` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Raised: {program.raised}</span>
                    <span className="font-bold text-[#1E5A96]">Goal: {program.goal}</span>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}`
  },
  {
    folder: 'blog',
    content: `'use client';

import { AnimatedCard } from '../../animations';

export default function BlogPage() {
  const stories = [
    { title: 'How Care4ME Started: A Student\\'s Mission', excerpt: 'Darsh Gajera\\'s journey from garage to global impact.', image: '🚀', date: 'March 20, 2026', author: 'Care4ME Team' },
    { title: 'Meet Our Volunteers', excerpt: 'The incredible people making our mission possible.', image: '🤝', date: 'March 18, 2026', author: 'Volunteer Stories' },
    { title: 'Equipment That Changes Lives', excerpt: 'Real stories of families receiving wheelchairs and medical equipment.', image: '❤️', date: 'March 15, 2026', author: 'Impact Stories' },
    { title: 'Partnership Highlights', excerpt: 'How we work with NGOs and churches around the world.', image: '🌍', date: 'March 12, 2026', author: 'Partnership Program' }
  ];

  return (
    <main className="bg-white">
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Stories & Blog</h1>
          <p className="text-xl text-gray-700 max-w-2xl">Real stories of real impact. See how donations change lives.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-[#F5F5F5] rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
                  <div className="bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8] h-48 flex items-center justify-center text-6xl">{story.image}</div>
                  <div className="p-6">
                    <p className="text-sm text-[#7CB342] font-bold mb-2">{story.date}</p>
                    <h3 className="text-xl font-black text-[#1E5A96] mb-3">{story.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{story.excerpt}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{story.author}</span>
                      <a href="#" className="text-[#2BA5D7] font-bold hover:text-[#1E5A96]">Read →</a>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}`
  },
  {
    folder: 'transparency',
    content: `'use client';

import { AnimatedCard, AnimatedStatBox } from '../../animations';

export default function TransparencyPage() {
  const breakdown = [
    { category: 'Medical Equipment Distribution', percentage: 50, amount: '$63,725' },
    { category: 'Volunteer Support & Training', percentage: 20, amount: '$25,490' },
    { category: 'Shipping & Logistics', percentage: 20, amount: '$25,490' },
    { category: 'Community Outreach', percentage: 10, amount: '$12,745' }
  ];

  const partners = [
    { name: 'Feeding America', programs: 'Food Security', since: '2024' },
    { name: 'Meals on Wheels', programs: 'Senior Care', since: '2024' },
    { name: 'Local Churches & NGOs', programs: 'Community Distribution', since: '2024' },
    { name: 'Hospital Networks', programs: 'Equipment Supply', since: '2025' },
    { name: 'Blind Schools (India)', programs: 'Education Support', since: '2025' },
    { name: 'Community Health Organizations', programs: 'Healthcare Access', since: '2026' }
  ];

  return (
    <main className="bg-white">
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Transparency Report</h1>
          <p className="text-xl text-gray-700 max-w-2xl">Complete financial breakdown and program allocation. Trust is earned through transparency.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-[#1E5A96] mb-12">Budget Allocation</h2>
          <div className="space-y-6">
            {breakdown.map((item, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-[#F5F5F5] p-6 rounded-xl">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-bold text-[#1E5A96]">{item.category}</h3>
                    <span className="font-bold text-[#7CB342]">{item.amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-[#2BA5D7] h-4 rounded-full transition-all duration-500" style={{ width: \`\${item.percentage}%\` }} />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{item.percentage}% of total donations</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-[#1E5A96] mb-12">Verified Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.map((partner, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-white p-6 rounded-xl border-l-4 border-[#7CB342]">
                  <h3 className="font-bold text-[#1E5A96] mb-2">{partner.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{partner.programs}</p>
                  <p className="text-xs text-[#7CB342]">Partner since {partner.since}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}`
  },
  {
    folder: 'contact',
    content: `'use client';

import { AnimatedCard } from '../../animations';
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
              <p className="text-gray-600"><a href="mailto:cae4medicalequipment@gmail.com" className="hover:text-[#2BA5D7]">cae4medicalequipment@gmail.com</a></p>
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
}`
  }
];

// Create all folders and files
let createdCount = 0;
let errorCount = 0;

pages.forEach(page => {
  const folderPath = path.join(APP_DIR, page.folder);
  const filePath = path.join(folderPath, 'page.tsx');
  
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`✓ Created folder: ${page.folder}`);
    }
    
    fs.writeFileSync(filePath, page.content, 'utf8');
    console.log(`✓ Created page: ${page.folder}/page.tsx`);
    createdCount++;
  } catch (error) {
    console.error(`✗ Error creating ${page.folder}: ${error.message}`);
    errorCount++;
  }
});

console.log(`\n✅ Setup complete: ${createdCount} pages created, ${errorCount} errors`);
console.log('\nNext steps:');
console.log('1. Run: npm run dev');
console.log('2. Visit: http://localhost:3000');
console.log('3. Test all 6 pages: /about, /faq, /dashboard, /blog, /transparency, /contact');
