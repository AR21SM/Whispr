"use client"
import "@fontsource/nunito/800.css";
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 fixed z-50 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          {/* Logo Section (Left) */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/assets/logo.png" 
                className="h-14 ml-9" 
                alt="Whispr Logo" 
                width={130}
                height={40}
              />
            </Link>
          </div>
          
          {/* Navigation Tabs (Center) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              <Link href="/home" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
                Home
              </Link>
              <Link href="/submit-report" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
                Submit Report
              </Link>
              <Link href="/my-reports" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
                My Reports
              </Link>
              <Link href="/feedback" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
                Feedback
              </Link>
            </div>
          </div>
          
          {/* Right side - intentionally left empty */}
          <div className="flex items-center">
            {/* Empty div to maintain flex layout balance */}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu (Only visible on small screens) */}
      <div className="md:hidden border-t border-gray-200">
        <div className="grid grid-cols-4 text-center">
          <Link href="/" className="py-2 text-sm text-gray-700 hover:bg-gray-100">
            Home
          </Link>
          <Link href="/submit-report" className="py-2 text-sm text-gray-700 hover:bg-gray-100">
            Submit Report
          </Link>
          <Link href="/my-reports" className="py-2 text-sm text-gray-700 hover:bg-gray-100">
            My Reports
          </Link>
          <Link href="/feedback" className="py-2 text-sm text-gray-700 hover:bg-gray-100">
            Feedback
          </Link>
        </div>
      </div>
    </nav>
  );
}