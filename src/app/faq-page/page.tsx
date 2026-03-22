'use client';

import { AnimatedCard } from '../animations';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Would I be able to hold an event in your name to raise money for Care4ME?',
      answer: 'Yes, but not without our permission. You would have to email, text, or call us regarding this. Our contact information can be found on our Contact page. We love community fundraising efforts and want to work with you!'
    },
    {
      question: 'What exactly is getting donated?',
      answer: 'We redistribute wheelchairs, walkers, adult diapers, and other essential medical equipment. As we grow, we\'re working to accept hospital beds and equipment that hospitals can no longer use but are still valuable to communities in need around the world.'
    },
    {
      question: 'Can I sponsor a specific category of item if I want my donation to go to a certain cause?',
      answer: 'Yes! Visit our Donate page where you can choose to fund one of our ongoing programs. Whether it\'s wheelchairs, mobility aids, or other equipment categories, you can direct your donation to the cause that matters most to you.'
    },
    {
      question: 'How do I see what happens with my money?',
      answer: 'Follow us on social media! We share regular updates on Instagram, Facebook, and TikTok showing exactly where donations go and the impact they create. We believe in transparency and want you to see the real difference your donation makes.'
    },
    {
      question: 'Does Care4ME accept international donations?',
      answer: 'Yes, we do! If your payment method doesn\'t work with our standard system, please reach out to us directly. We\'ll work something out to accept your donation. Contact us at cae4medicalequipment@gmail.com or call 609-367-4603.'
    },
    {
      question: 'Is Care4ME a registered nonprofit?',
      answer: 'Yes, we are a 501(c)(3) nonprofit organization registered in New Jersey. Every donation is tax-deductible. We operate with zero overhead, meaning 100% of donations fund our mission directly.'
    },
    {
      question: 'How can I volunteer with Care4ME?',
      answer: 'Visit our Volunteer page to learn about current opportunities. We work with both remote volunteers and in-person partners. Whether you can help with collections, inspections, shipping coordination, or fundraising, we\'d love to have you on our team!'
    },
    {
      question: 'Can organizations partner with Care4ME?',
      answer: 'Absolutely! We work with churches, NGOs, hospitals, and community organizations. If you\'re interested in partnering with us, please reach out to cae4medicalequipment@gmail.com or call 609-367-4603. Let\'s talk about how we can work together.'
    }
  ];

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700"
          >
            Everything you need to know about Care4ME. Can't find your answer? Contact us directly!
          </motion.p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.05}>
                <motion.div
                  className="bg-[#F5F5F5] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                >
                  <div className="p-6 flex justify-between items-center bg-white border-b-2 border-[#E8F4F8]">
                    <h3 className="text-lg font-black text-[#1E5A96] flex-1 text-left">
                      {faq.question}
                    </h3>
                    <motion.span
                      animate={{ rotate: openIndex === idx ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl text-[#7CB342] ml-4 flex-shrink-0"
                    >
                      ▼
                    </motion.span>
                  </div>

                  <motion.div
                    className="overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: openIndex === idx ? 'auto' : 0,
                      opacity: openIndex === idx ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    
                  >
                    <div className="p-6 bg-[#F5F5F5] text-gray-700 leading-relaxed text-base">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 bg-[#1E5A96] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-6">Still have questions?</h2>
            <p className="text-xl text-gray-100 mb-8">
              Reach out to our team directly. We're here to help!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
                <div className="text-2xl mb-2">📧</div>
                <p className="font-bold mb-2">Email</p>
                <a href="mailto:cae4medicalequipment@gmail.com" className="text-[#7CB342] hover:text-white transition">
                  cae4medicalequipment@gmail.com
                </a>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
                <div className="text-2xl mb-2">📞</div>
                <p className="font-bold mb-2">Phone</p>
                <a href="tel:6093674603" className="text-[#7CB342] hover:text-white transition">
                  (609) 367-4603
                </a>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
                <div className="text-2xl mb-2">💬</div>
                <p className="font-bold mb-2">Social Media</p>
                <p className="text-gray-100 text-sm">
                  DM us on Instagram, Facebook, or TikTok
                </p>
              </div>
            </div>

            <a
              href="/contact.tsx"
              className="inline-block bg-[#7CB342] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#6BA034] transition"
            >
              Go to Contact Page
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
