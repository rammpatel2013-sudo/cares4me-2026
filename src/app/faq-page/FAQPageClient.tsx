'use client';

import { AnimatedCard } from '../animations';
import { useState } from 'react';
import { motion } from 'framer-motion';

type FAQPageContent = {
  hero: {
    title: string;
    description: string;
  };
  questions: Array<{
    question: string;
    answer: string;
  }>;
  cta: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
  ctaCards: Array<{
    icon: string;
    title: string;
    value: string;
    href?: string;
  }>;
};

export default function FAQPageClient({ content }: { content: FAQPageContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="bg-white">
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6"
          >
            {content.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700"
          >
            {content.hero.description}
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {content.questions.map((faq, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.05}>
                <motion.div
                  className="bg-[#F5F5F5] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                >
                  <div className="p-6 flex justify-between items-center bg-white border-b-2 border-[#E8F4F8]">
                    <h3 className="text-lg font-black text-[#1E5A96] flex-1 text-left">{faq.question}</h3>
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
                      opacity: openIndex === idx ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-6">{content.cta.title}</h2>
            <p className="text-xl text-gray-100 mb-8">{content.cta.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {content.ctaCards.map((card, idx) => (
                <div key={`${card.title}-${idx}`} className="bg-white/10 p-6 rounded-lg backdrop-blur">
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <p className="font-bold mb-2">{card.title}</p>
                  {card.href ? (
                    <a href={card.href} className="text-[#7CB342] hover:text-white transition break-all">
                      {card.value}
                    </a>
                  ) : (
                    <p className="text-gray-100 text-sm">{card.value}</p>
                  )}
                </div>
              ))}
            </div>

            <a
              href={content.cta.buttonHref}
              className="inline-block bg-[#7CB342] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#6BA034] transition"
            >
              {content.cta.buttonLabel}
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
