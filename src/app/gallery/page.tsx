import { getMediaByDestination } from '@/lib/getMedia';
import GalleryClient from './GalleryClient';
import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Gallery | Care4ME',
  description: 'View the impact of Care4ME through our community gallery and events.',
};
  title: 'Gallery | Care4ME',
  description: 'View the impact of Care4ME through our community gallery and events.',
};

export default async function GalleryPage() {
  // Fetch metadata securely on the server
  const items = await getMediaByDestination('gallery');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-[#1E5A96] mb-6 tracking-tight">
          Our Visual Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Explore the moments, events, and success stories that define our mission to restore health and renew hope within the community.
        </p>
      </div>
      
      {/* Client Component to handle filtering and Framer Motion animations */}
      <GalleryClient items={items} />
    </div>
  );
}