import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';

export const metadata: Metadata = {
  title: 'Postiz by Leap Tech LLC - Social Media Management Platform',
  description: 'Schedule, publish, and manage your social media content across multiple platforms with Postiz by Leap Tech LLC.',
};

export default function HomePage() {
  const isGeneral = isGeneralServerSide();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Image
            src={isGeneral ? '/postiz.svg' : '/logo.svg'}
            width={40}
            height={40}
            alt="Postiz Logo"
          />
          <span className="text-2xl font-bold">Postiz</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/auth"
            className="text-gray-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth"
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
          Manage All Your Social Media in One Place
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
          Postiz helps you schedule posts, analyze performance, and grow your audience across all major social media platforms.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth"
            className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition"
          >
            Start Free Trial
          </Link>
          <Link
            href="/auth"
            className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-gray-400 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Powerful features to help you manage your social media presence effectively
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Scheduling</h3>
              <p className="text-gray-400">
                Schedule your posts in advance and let Postiz publish them at the perfect time for maximum engagement.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
              <p className="text-gray-400">
                Track your performance with detailed analytics and insights to optimize your content strategy.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-gray-400">
                Work together with your team members to create and manage content seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Connect Your Favorite Platforms
        </h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Manage all your social media accounts from a single dashboard
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
              <span className="text-2xl">𝕏</span>
            </div>
            <span className="text-sm">X / Twitter</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
              <span className="text-2xl">in</span>
            </div>
            <span className="text-sm">LinkedIn</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
              <span className="text-2xl">f</span>
            </div>
            <span className="text-sm">Facebook</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
              <span className="text-2xl">IG</span>
            </div>
            <span className="text-sm">Instagram</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
              <span className="text-2xl">TT</span>
            </div>
            <span className="text-sm">TikTok</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
              <span className="text-2xl">YT</span>
            </div>
            <span className="text-sm">YouTube</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Grow Your Social Presence?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators and businesses who trust Postiz to manage their social media.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-white text-black px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={isGeneral ? '/postiz.svg' : '/logo.svg'}
              width={24}
              height={24}
              alt="Postiz Logo"
            />
            <span className="text-gray-400">Postiz by Leap Tech LLC</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <Link href="/legal/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
