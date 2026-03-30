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
                  <img src="/loggoo.jpg" alt="Care4ME Logo" className="h-8 w-8" />
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
                <div className="flex flex-col space-y-2 text-sm">
                  <a href="https://www.instagram.com/care4medicalequipment/" target="_blank" rel="noopener noreferrer" className="hover:text-[#7CB342] transition flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    Instagram
                  </a>
                  <a href="https://www.facebook.com/care4medicalequipment/" target="_blank" rel="noopener noreferrer" className="hover:text-[#7CB342] transition flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    Facebook
                  </a>
                  <a href="https://www.tiktok.com/@care4medicalequipment" target="_blank" rel="noopener noreferrer" className="hover:text-[#7CB342] transition flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                    TikTok
                  </a>
                  <a href="https://www.linkedin.com/company/care4me" target="_blank" rel="noopener noreferrer" className="hover:text-[#7CB342] transition flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    LinkedIn
                  </a>
                  <a href="https://twitter.com/care4me" target="_blank" rel="noopener noreferrer" className="hover:text-[#7CB342] transition flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
                    Twitter
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-[#7CB342]">Contact</h4>
                <div className="text-sm text-gray-100">
  <div>Email: <a href="mailto:care4medicalequipment@gmail.com" className="underline hover:text-[#7CB342]">care4medicalequipment@gmail.com</a></div>
  <div>Phone: (609) 367-4603</div>
</div>
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