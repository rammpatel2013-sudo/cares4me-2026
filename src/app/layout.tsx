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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-2xl font-black text-[#2BA5D7]">
              Care4ME
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="/" className="text-gray-700 hover:text-[#2BA5D7] transition">Home</a>
              <a href="/team" className="text-gray-700 hover:text-[#2BA5D7] transition">Team</a>
              <a href="/gallery" className="text-gray-700 hover:text-[#2BA5D7] transition">Gallery</a>
              <a href="/volunteer" className="text-gray-700 hover:text-[#2BA5D7] transition">Volunteer</a>
              <a href="/partners" className="text-gray-700 hover:text-[#2BA5D7] transition">Partners</a>
              <a href="/campaigns" className="text-gray-700 hover:text-[#2BA5D7] transition">Campaigns</a>
              <a
                href="/donate"
                className="bg-[#2BA5D7] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1E5A96] transition"
              >
                Donate
              </a>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <a
                href="/donate"
                className="bg-[#2BA5D7] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1E5A96] transition text-sm"
              >
                Donate
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-20 flex-grow">{children}</main>

        {/* Footer */}
        <footer className="bg-[#1E5A96] text-white py-16 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
              <div>
                <h3 className="text-2xl font-black mb-4">Care4ME</h3>
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
