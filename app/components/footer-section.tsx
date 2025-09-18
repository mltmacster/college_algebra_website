
'use client';

import Link from 'next/link';
import { Calculator, Mail, MapPin, Phone } from 'lucide-react';

export function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-xl">College Algebra</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Interactive College Algebra learning platform designed for undergraduate business students. 
              Master mathematical concepts through engaging modules, earn digital badges, and get AI-powered tutoring support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Learning</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/modules" className="text-gray-400 hover:text-white transition-colors">
                  All Modules
                </Link>
              </li>
              <li>
                <Link href="/progress" className="text-gray-400 hover:text-white transition-colors">
                  My Progress
                </Link>
              </li>
              <li>
                <Link href="/progress" className="text-gray-400 hover:text-white transition-colors">
                  Digital Badges
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Get Help
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 College Algebra Learning Platform. Designed for undergraduate business students.
          </p>
        </div>
      </div>
    </footer>
  );
}
