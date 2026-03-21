'use client';

import { motion } from 'framer-motion';

export function AnimatedHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-center space-y-6"
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        className="text-6xl lg:text-7xl font-black text-[#1E5A96]"
      >
        Restoring Health, Renewing Hope
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="text-xl text-gray-700 max-w-2xl mx-auto"
      >
        One Step at a Time. Transform lives through compassionate care and community support.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        className="flex gap-4 justify-center flex-wrap"
      >
        <a
          href="/donate"
          className="bg-[#2BA5D7] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#1E5A96] transition"
        >
          Donate Now
        </a>
        <a
          href="/volunteer"
          className="bg-[#7CB342] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#6BA034] transition"
        >
          Volunteer
        </a>
      </motion.div>
    </motion.div>
  );
}

export function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedStatBox({ value, label, color = '#2BA5D7' }: { value: string; label: string; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-4xl font-black mb-2"
        style={{ color }}
      >
        {value}
      </motion.div>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
}
