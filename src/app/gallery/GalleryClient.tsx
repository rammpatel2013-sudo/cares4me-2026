"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaMetadata } from '@/lib/getMedia';

export default function GalleryClient({ items }: { items: MediaMetadata[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Extract unique categories safely
  const categories = ['all', ...Array.from(new Set(items.map(item => item.category || 'general')))];

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => (item.category || 'general') === activeCategory);

  return (
    <div>
      {/* Filter Dropdown */}
      <div className="flex justify-center mb-16">
        <div className="relative w-full max-w-sm">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full appearance-none bg-white border-2 border-gray-200 text-gray-700 py-3.5 px-6 pr-12 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[#7CB342]/20 focus:border-[#7CB342] font-semibold transition-all cursor-pointer hover:shadow-md text-lg"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Gallery Photos' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-gray-500">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* Masonry/Grid Layout */}
      {filteredItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="text-5xl mb-4">📷</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No photos yet</h3>
          <p className="text-gray-500 text-lg">Check back soon for new gallery updates!</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.filename}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-white border border-gray-100 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative h-[320px] bg-gray-100 overflow-hidden shrink-0">
                  <img 
                    src={`/api/media?file=${item.timestamp}-web.webp`}
                    alt={item.caption || 'Community Impact'}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    onError={(e) => {
                      // Fallback to original image if webp wasn't generated
                      (e.target as HTMLImageElement).src = `/api/media?file=${item.filename}`;
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Card Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-[#1E5A96] bg-[#1E5A96]/10 px-4 py-1.5 rounded-full">
                      {item.category || 'General'}
                    </span>
                    <span className="text-gray-400 text-sm font-medium">
                      {new Date(item.published).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium leading-relaxed text-lg">
                    {item.caption || 'A memorable moment from our community.'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
