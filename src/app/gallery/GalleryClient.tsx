"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaMetadata } from '@/lib/getMedia';

export default function GalleryClient({ items }: { items: MediaMetadata[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<MediaMetadata | null>(null);
  
  const categories = ['all', ...Array.from(new Set(items.map(item => item.category || 'general')))];

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => (item.category || 'general') === activeCategory);

  return (
    <div>
      {/* Filter Dropdown */}
      <div className="flex justify-center mb-10">
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7CB342] font-semibold text-base"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Photos' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Pinterest-style Masonry Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📷</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No photos yet</h3>
          <p className="text-gray-500">Check back soon for updates!</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-2 lg:columns-3 gap-3 sm:gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.filename}
              onClick={() => setSelectedImage(item)}
              className="break-inside-avoid mb-3 sm:mb-4 cursor-pointer group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <img 
                src={`/api/image?file=${item.timestamp}-web.webp`}
                alt={item.caption || 'Gallery image'}
                className="w-full h-auto block"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/api/image?file=${item.filename}`;
                }}
              />
              
              {/* Bottom Gradient Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4 pt-8 sm:pt-10">
                <p className="text-white font-medium text-sm sm:text-base truncate">
                  {item.caption || 'Community moment'}
                </p>
                <p className="text-white/70 text-xs sm:text-sm mt-0.5">
                  {item.category || 'General'}
                </p>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium transition-opacity duration-200 shadow-lg">
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col cursor-default shadow-2xl"
            >
              {/* Image */}
              <div className="relative flex-1 min-h-0 bg-gray-100">
                <img
                  src={`/api/image?file=${selectedImage.timestamp}-web.webp`}
                  alt={selectedImage.caption || 'Gallery image'}
                  className="w-full h-full object-contain max-h-[60vh]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/api/image?file=${selectedImage.filename}`;
                  }}
                />
              </div>
              
              {/* Details */}
              <div className="p-5 sm:p-6 border-t">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="inline-block text-xs font-bold uppercase tracking-wide text-[#7CB342] bg-[#7CB342]/10 px-3 py-1 rounded-full mb-2">
                      {selectedImage.category || 'General'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {selectedImage.caption || 'Community moment'}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(selectedImage.published).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
