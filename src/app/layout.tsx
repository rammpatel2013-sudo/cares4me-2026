import Navbar from './Navbar';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Care4ME - Restoring Health, Renewing Hope",
  description: "Transforming lives through health restoration and community care. Donate, volunteer, or partner with us today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Navbar />
        <main className="pt-20 flex-grow">{children}</main>
        <footer className="bg-[#1E5A96] text-white py-16 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img src="/care4me.jpg" alt="Care4ME Logo" className="h-8 w-8" />
                  <h3 className="text-2xl font-black">Care4ME</h3>
                </div>
                <p className="text-gray-100 text-sm leading-relaxed">Restoring Health, Renewing Hope One Step at a Time</p>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-[#7CB342]">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="hover:text-[#7CB342] transition">Home</a></li>
                  <li><a href="/team" className="hover:text-[#7CB342] transition">Team</a></li>
                  <li><a href="/gallery" className="hover:text-[#7CB342] transition">Gallery</a></li>
                  <li><a href="/campaigns" className="hover:text-[#7CB342] transition">Campaigns</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-[#7CB342]">Get Involved</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/donate" className="hover:text-[#7CB342] transition">Donate</a></li>
                  <li><a href="/volunteer" className="hover:text-[#7CB342] transition">Volunteer</a></li>
                  <li><a href="/partners" className="hover:text-[#7CB342] transition">Partner With Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-[#7CB342]">Follow Us</h4>
                <div className="flex flex-col gap-2 text-sm">
                  <a href="https://www.instagram.com/care4medicalequipment/" target="_blank" rel="noopener noreferrer" className="hover:text-[#7CB342] transition">
                    📷 Instagram
                  </a>
                  <a href="https://www.facebook.com/care4medicalequipment/" target="_blank" rel="noopener noreferrer" className="hover:text-[#7CB342] transition">
                    👍 Facebook
                  </a>
                  <a href="https://www.tiktok.com/@care4medicalequipment" target="_blank" rel="noopener noreferrer" className="hover:text-[#7CB342] transition">
                    🎵 TikTok
                  </a>
                  <a href="https://www.linkedin.com/company/care4me" target="_blank" rel="noopener noreferrer" className="hover:text-[#7CB342] transition">
                    💼 LinkedIn
                  </a>
                  <a href="https://twitter.com/care4me" target="_blank" rel="noopener noreferrer" className="hover:text-[#7CB342] transition">
                    𝕏 Twitter
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-[#7CB342]">Contact</h4>
                <p className="text-sm text-gray-100">Email: info@caresforu.com</p>
                <p className="text-sm text-gray-100">Phone: (555) 123-4567</p>
              </div>
            </div>
            <div className="border-t border-white/20 pt-8 text-center text-sm text-gray-200">
              <p>&copy; 2026 Care4ME. All rights reserved. | 501(c)(3) Nonprofit Organization</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}