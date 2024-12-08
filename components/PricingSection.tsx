                import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import PlusIcon from "./icons/PlusIcon";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-white/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-gray-50 rounded-full mb-4">
            <span className="text-sm font-medium text-gray-600">Our Pricing</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Our Pricing Plans</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our powerful solutions for seamless WhatsApp messaging. Choose the plan that best fits your needs.
          </p>
        </div>

        {/* Pricing Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Starter Plan */}
          <Card className={`p-8 hover:shadow-lg transition-shadow relative overflow-hidden border border-gray-200`}>
            <div className="absolute top-0 right-0 bg-gradient-to-b from-green-200 to-green-100 w-32 h-32 transform translate-x-16 -translate-y-16 rounded-full opacity-20"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm inline-block mb-4">
                For Individuals
              </div>
              <div className="flex items-baseline mb-6">
                <motion.div
                  className="flex items-center justify-center text-[#5b5f59]"
                  style={{ 
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
                    width: "24px",
                    height: "24px"
                  }}
                >
                  <PlusIcon />
                </motion.div>
                <span className="ml-2 text-4xl font-bold">$299</span>
                <span className="ml-2 text-gray-500">/ year</span>
              </div>
              <Button className="w-full mb-6">Get Started</Button>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Task Management
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Real-time Collaboration
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Basic Analytics
                </li>
              </ul>
            </div>
          </Card>

          {/* Pro Plan */}
          <Card className={`p-8 hover:shadow-lg transition-shadow relative overflow-hidden border-2 border-green-500`}>
            <div className="absolute top-0 right-0 bg-gradient-to-b from-green-300 to-green-100 w-32 h-32 transform translate-x-16 -translate-y-16 rounded-full opacity-20"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm inline-block mb-4">
                For Startups
              </div>
              <div className="flex items-baseline mb-6">
                <motion.div
                  className="flex items-center justify-center text-green-500"
                  style={{ 
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
                    width: "24px",
                    height: "24px"
                  }}
                >
                  <PlusIcon />
                </motion.div>
                <span className="ml-2 text-4xl font-bold">$599</span>
                <span className="ml-2 text-gray-500">/ year</span>
              </div>
              <Button className="w-full mb-6 bg-black hover:bg-gray-800">Get Started</Button>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Everything in Starter
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Advanced Analytics
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Priority Support
                </li>
              </ul>
            </div>
          </Card>

          {/* Enterprise Plan */}
          <Card className={`p-8 hover:shadow-lg transition-shadow relative overflow-hidden border border-gray-200`}>
            <div className="absolute top-0 right-0 bg-gradient-to-b from-green-200 to-green-100 w-32 h-32 transform translate-x-16 -translate-y-16 rounded-full opacity-20"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm inline-block mb-4">
                For Organizations
              </div>
              <div className="flex items-baseline mb-6">
                <motion.div
                  className="flex items-center justify-center text-[#5b5f59]"
                  style={{ 
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
                    width: "24px",
                    height: "24px"
                  }}
                >
                  <PlusIcon />
                </motion.div>
                <span className="ml-2 text-4xl font-bold">$999</span>
                <span className="ml-2 text-gray-500">/ year</span>
              </div>
              <Button className="w-full mb-6">Get Started</Button>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Everything in Pro
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Dedicated Support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Custom Solutions
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Discount Banner */}
      <div className="mt-12 text-center">
        <div className="inline-block bg-gradient-to-r from-green-200 to-green-100 px-6 py-2 rounded-full">
          <p className="text-sm font-medium text-gray-800">
            Use "FIRST100" code for 60% Discount
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
