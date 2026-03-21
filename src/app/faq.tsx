'use client';

import { AnimatedCard } from './animations';
import { useState } from 'react';

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How are donations used?',
      answer: '100% of donations directly fund our health programs. We have zero overhead costs because our team volunteers their time.'
    },
    {
      question: 'What programs do you run?',
      answer: 'We run 18 active programs including student education in India, senior nutrition, women wellness, and healthcare access initiatives.'
    },
    {
      question: 'Can I volunteer?',
      answer: 'Yes! Visit our Volunteer page to see current opportunities. We work with remote volunteers and in-person partners.'
    },
    {
      question: 'Where does the money go?',
      answer: 'All donations are distributed to verified partner organizations in India (education, blind school support) and USA (senior care, women wellness).'
    },
    {
      question: 'Is Care4ME a registered nonprofit?',
      answer: 'Yes, we are a 501(c)(3) nonprofit organization. Tax ID available upon request.'
    },
    {
      question: 'How can I partner with Care4ME?',
      answer: 'Organizations can partner with us in multiple ways. Visit our Partners page or contact info@caresforu.com to discuss opportunities.'
    },
  ];

  return (
    <main className="bg-white">
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Everything you need to know about Care4ME.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <AnimatedCard key={idx} delay={idx * 0.05}>
              <div
                className="bg-[#F5F5F5] rounded-lg mb-4 overflow-hidden cursor-pointer hover:shadow-md transition"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <div className="p-6 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#1E5A96]">{faq.question}</h3>
                  <span className="text-2xl text-[#2BA5D7]">{open === idx ? '−' : '+'}</span>
                </div>
                {open === idx && (
                  <div className="px-6 pb-6 border-t border-gray-200 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>
    </main>
  );
}
