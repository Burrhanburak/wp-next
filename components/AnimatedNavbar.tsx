'use client';

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";

const AnimatedNavbar = ({ className }: { className?: string }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;
    if (Math.abs(difference) > 50) {
      setIsHidden(difference > 0);
      lastYRef.current = y;
    }
  });

  return (
    <>
      <motion.div
        animate={isHidden ? "hidden" : "visible"}
        whileHover="visible"
        onFocusCapture={() => setIsHidden(false)}
        variants={{
          hidden: {
            y: "-90%",
          },
          visible: {
            y: "0%",
          },
        }}
        transition={{ duration: 0.2 }}
        className="sticky top-0 z-10 flex w-full justify-center pt-3"
        style={{ willChange: "transform" }}
      >
        <nav className="flex justify-between gap-3 rounded-3xl bg-white p-2 shadow-sm *:rounded-xl *:px-3 *:py-1 *:transition-colors *:duration-300 hover:*:bg-green-50 focus-visible:*:bg-green-50">
          <Link href="#" className="bg-green-50 text-green-600 flex items-center justify-center">
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.4 3.6A11.25 11.25 0 0012 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.5 6L0 24l6.2-1.5c1.8.9 3.9 1.5 6 1.5 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.4-8.4zm-8.4 18.3c-1.8 0-3.6-.6-5.1-1.5l-.3-.3-3.9.9.9-3.9-.3-.3c-1.2-1.8-1.5-3.9-1.5-6 0-5.7 4.8-10.5 10.5-10.5 2.7 0 5.4 1.2 7.2 3 1.8 1.8 3 4.5 3 7.2-.3 5.7-4.8 10.4-10.5 10.4zm5.7-7.8c-.3-.3-.9-.3-1.2-.3-.3 0-.6.3-.9.3s-1.2.6-1.5.6c-.3.3-.6.3-.9 0-.3-.3-1.2-.6-2.4-1.8-1.2-.9-1.8-2.1-2.1-2.4-.3-.3 0-.6.3-.9.3-.3.6-.6.6-.9.3-.3 0-.6 0-.9 0-.3-.9-2.1-1.2-2.7-.3-.6-.6-.3-.9-.3h-.9c-.3 0-.9.3-1.2.6-.6.6-1.2 1.2-1.2 2.4 0 1.2.9 2.4 1.2 2.7.3.3 3 4.8 7.2 6.6 4.2 1.8 4.2 1.2 5.1 1.2.9 0 2.7-1.2 3-2.1.3-.9.3-1.8 0-1.8z"/>
            </svg>
            <span className="sr-only">Home</span>
          </Link>
     
          <Link href="#features" className="text-gray-600 hover:text-green-600 max-md:hidden flex items-center justify-center">Products</Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden text-gray-600 hover:text-green-600 flex items-center justify-center"
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
          <Link href="#pricing" className="text-gray-600 hover:text-green-600 max-md:hidden flex items-center justify-center">Services</Link>
          <Link href="#faq" className="text-gray-600 hover:text-green-600 max-md:hidden flex items-center justify-center">About</Link>
         
          <div className="flex gap-2">
            <Link href="/signin" className="relative text-gray-600 hover:text-green-600 bg-gray-50/80 px-4 py-2 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-50 blur-md group-hover:opacity-75 transition-opacity"></div>
              <span className="relative">Sign In</span>
            </Link>
            <Link href="/signup" className="relative text-white px-4 py-2 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-90 blur-md group-hover:opacity-100 transition-opacity"></div>
              <span className="relative">Get Started</span>
            </Link>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-[72px] left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[400px] z-50 overflow-hidden"
          >
            <nav className="bg-white rounded-2xl shadow-lg p-2 flex flex-col gap-1">
              <Link 
                href="#features" 
                className="text-gray-600 hover:text-green-600 p-2 rounded-xl hover:bg-green-50 transition-colors flex items-center "
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="#pricing" 
                className="text-gray-600 hover:text-green-600 p-2 rounded-xl hover:bg-green-50 transition-colors flex items-center "
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="#faq" 
                className="text-gray-600 hover:text-green-600 p-2 rounded-xl hover:bg-green-50 transition-colors flex items-center "
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="h-px bg-gray-100 my-1"></div>
              <Link 
                href="/signin" 
                className="text-gray-600 hover:text-green-600 p-2 rounded-xl hover:bg-green-50 transition-colors flex items-center "
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="text-white bg-green-600 hover:bg-green-700 p-2 rounded-xl text-center transition-colors flex items-center "
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedNavbar;
