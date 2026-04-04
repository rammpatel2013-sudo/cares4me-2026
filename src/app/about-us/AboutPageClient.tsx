'use client';

import { AnimatedCard } from '../animations';
import { motion } from 'framer-motion';

type AboutUsContent = {
  hero: {
    badge: string;
    title: string;
    emphasis: string;
    description: string;
  };
  impacts: Array<{
    number: string;
    label: string;
  }>;
  story: {
    heading: string;
    paragraphs: string[];
    quote: string;
  };
  mission: {
    heading: string;
    description: string;
  };
  values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  cta: {
    title: string;
    description: string;
    buttons: Array<{
      label: string;
      href: string;
      style: string;
    }>;
  };
};

function renderHeroTitle(title: string, emphasis: string) {
  if (!emphasis || !title.includes(emphasis)) {
    return title;
  }

  const [before, after] = title.split(emphasis);
  return (
    <>
      {before}
      <em className="italic text-[#7CB342]">{emphasis}</em>
      {after}
    </>
  );
}

export default function AboutPageClient({ content }: { content: AboutUsContent }) {
  return (
    <main className="bg-white">
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-bold text-[#2BA5D7] mb-6">
              {content.hero.badge}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6 leading-tight"
          >
            {renderHeroTitle(content.hero.title, content.hero.emphasis)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-2xl leading-relaxed"
          >
            {content.hero.description}
          </motion.p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.impacts.map((item, idx) => (
              <AnimatedCard key={`${item.label}-${idx}`} delay={idx * 0.1}>
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
            <h2 className="text-4xl font-black text-[#1E5A96] mb-8">{content.story.heading}</h2>
            {content.story.paragraphs.slice(0, 2).map((paragraph, idx) => (
              <p key={`story-top-${idx}`} className="text-lg text-gray-700 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </AnimatedCard>

          <AnimatedCard delay={0.1}>
            <div className="bg-[#E8F4F8] border-l-4 border-[#7CB342] p-8 rounded-lg my-12">
              <p className="text-2xl font-black text-[#1E5A96] italic">
                &quot;{content.story.quote}&quot;
              </p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            {content.story.paragraphs.slice(2).map((paragraph, idx) => (
              <p key={`story-bottom-${idx}`} className={`text-lg text-gray-700 leading-relaxed ${idx === 0 ? 'mb-6' : ''}`}>
                {paragraph}
              </p>
            ))}
          </AnimatedCard>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5] border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-[#1E5A96] mb-6">{content.mission.heading}</h2>
            <p className="text-lg text-gray-700 mb-12 leading-relaxed">{content.mission.description}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.values.map((value, idx) => (
              <AnimatedCard key={`${value.title}-${idx}`} delay={idx * 0.1}>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-4">{content.cta.title}</h2>
            <p className="text-lg text-gray-100 mb-8">{content.cta.description}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              {content.cta.buttons.map((button, idx) => (
                <a
                  key={`${button.label}-${idx}`}
                  href={button.href}
                  className={button.style === 'primary-green'
                    ? 'bg-[#7CB342] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#6BA034] transition'
                    : 'border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#1E5A96] transition'}
                >
                  {button.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
