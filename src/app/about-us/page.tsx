'use client';

import { AnimatedCard } from '../animations';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const values = [
    {
      icon: '❤️',
      title: 'Health First',
      description: 'Every decision guided by the health and dignity of those we serve.'
    },
    {
      icon: '♻️',
      title: 'Zero Waste',
      description: 'Surplus in one part of the world should never go to waste.'
    },
    {
      icon: '🤝',
      title: 'Trust-Based',
      description: 'We work through partners who have earned trust in their communities.'
    },
    {
      icon: '💰',
      title: 'Zero Overhead',
      description: 'Every dollar donated covers our mission — nothing else.'
    }
  ];

  const impacts = [
    { number: '$750K+', label: 'Goods Redistributed' },
    { number: '10-20', label: 'NGO Partners' },
    { number: '2024', label: 'Founded' },
    { number: '0%', label: 'Overhead on Donations' }
  ];

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-bold text-[#2BA5D7] mb-6">
              ✓ 501(c)(3) Nonprofit
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6 leading-tight"
          >
            Giving medical equipment <em className="italic text-[#7CB342]">a second life.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-2xl leading-relaxed"
          >
            Restoring health and renewing hope — one wheelchair, one walker, one family at a time.
          </motion.p>
        </div>
      </section>

      {/* Impact Bar */}
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

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <AnimatedCard>
            <h2 className="text-4xl font-black text-[#1E5A96] mb-8">Our Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Care4ME was founded in 2024 by Darsh Gajera, a high school student from New Jersey who saw a simple but urgent problem: across the United States, wheelchairs, walkers, hospital beds, and care supplies sit unused in garages and storage rooms — while families in rural communities around the world go without the most basic mobility and health equipment.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              What started as a small family effort — collecting items, inspecting them in the garage, and shipping them through trusted church and NGO partners — has grown into something that has redistributed over $750,000 in goods to under-resourced communities worldwide.
            </p>
          </AnimatedCard>

          {/* Quote */}
          <AnimatedCard delay={0.1}>
            <div className="bg-[#E8F4F8] border-l-4 border-[#7CB342] p-8 rounded-lg my-12">
              <p className="text-2xl font-black text-[#1E5A96] italic">
                "Every item we ship represents something a family couldn't otherwise afford. A wheelchair isn't just equipment — it's independence."
              </p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We operate the way we believe a nonprofit should: lean, transparent, and mission-first. Our team is small — Darsh, family members, and a growing group of volunteers. Our overhead is zero. Every donation goes directly toward getting supplies to the people who need them.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today Care4ME works with 10–20 partner churches and NGOs worldwide who handle last-mile distribution — getting items directly into the hands of families in rural areas that larger organizations often can't reach.
            </p>
          </AnimatedCard>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5] border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-[#1E5A96] mb-6">Our Mission & Values</h2>
            <p className="text-lg text-gray-700 mb-12 leading-relaxed">
              Our mission is to restore health and renew hope by giving used medical equipment and care items a second life in under-resourced rural communities worldwide.
            </p>
          </motion.div>

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

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-4">Ready to Make an Impact?</h2>
            <p className="text-lg text-gray-100 mb-8">Donate items, cover shipping costs, or partner with us.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/donate" className="bg-[#7CB342] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#6BA034] transition">
                Donate Now
              </a>
              <a href="/volunteer" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#1E5A96] transition">
                Volunteer
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
