import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AnimatedNavbar from "@/components/AnimatedNavbar";
import Marquee from "@/components/ui/marquee";
import PartnerCarousel from "@/components/PartnerCarousel";
import Background from "@/components/background";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import NewsletterSection from "@/components/NewsletterSection";
import ReviewSection from "@/components/ReviewSection";
import AutoScalingFeatures from "@/components/AutoScalingFeatures";
import CollaborationSection from "@/components/CollaborationSection";
import { FollowingPointerDemo } from "@/components/FollowingPointerDemo";
import dashaboard from "../public/mask.svg";

export default function Home() {
  return (
    <>
      <main className="relative w-full overflow-x-hidden">
        <div className="min-h-screen flex flex-col">
          <AnimatedNavbar className="relative z-50" />

          <div
            className="absolute top-0 right-0 z-[1] w-[280px] h-[460px] sm:w-[1047px] sm:h-[212px] opacity-50 overflow-visible flex-none 
          [filter:blur(100px)] [background:linear-gradient(180deg,var(--token-305af9d4-fe33-4ce3-9dac-e261fb045b39,#16a34a)_-43%,var(--token-305af9d4-fe33-4ce3-9dac-e261fb045b39,rgb(22,163,74))_100%)]"
          ></div>

          <section className="relative min-h-[calc(90vh-4rem)] flex items-center justify-center">
            <div className="container justify-center relative mx-auto px-4 ">
              <div className="max-w-3xl  mx-auto text-center">
                <h1 className="text-5xl md:text-6xl text-left font-bold mb-4">
                  <span className="bg-clip-text  text-transparent bg-gradient-to-r from-green-600 to-green-800">
                    Bulk WhatsApp Messages
                  </span>
                  <br />
                  Made Simple
                </h1>
                <p className="text-xl text-left text-gray-600 mb-6">
                  Send personalized WhatsApp messages to multiple contacts
                  instantly. Perfect for business communications and marketing
                  campaigns.
                </p>

                <div className="flex flex-col  md:flex-row gap-4  items-stretch md:items-center">
                  <Button className="bg-green-600  hover:bg-green-700 text-white px-8 py-6 text-lg w-full md:w-auto">
                    Start Free Trial
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-200 hover:bg-green-50 px-8 py-6 text-lg w-full md:w-auto"
                  >
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            {/* <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-green-200 to-green-300 opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-l from-green-200 to-green-300 opacity-20 blur-3xl"></div> */}
          </section>

          {/* Partner Carousel Section */}
          <PartnerCarousel />

          {/* Marquee Section */}
          <section className="w-full py-8 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center">
                <AutoScalingFeatures />
              </div>
            </div>
          </section>

          {/* Collaboration Section */}
          <section className="w-full py-12 overflow-hidden">
            <CollaborationSection />
          </section>

          {/* Bento Grid Features */}
          <section id="features" className="w-full py-20 bg-white/50">
            <div className="container mx-auto px-4">
              <div className="flex min-h-[600px] w-full flex-col items-center justify-center rounded-lg dark:bg-slate-900">
                <div className="grid h-full w-full grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Two column cards */}
                  <div className="h-[400px] rounded-3xl bg-neutral-50 p-6 flex flex-col">
                    <div className="space-y-4">
                      <h6 className="text-xl font-semibold text-[#070C03]">
                        Build AI Apps
                      </h6>
                      <p className="text-[#657084]">
                        No more file restrictions and complicated templates.
                        Easily integrate LLMs like ChatGPT with vector
                        databases, PDF, OCR.
                      </p>
                    </div>
                    <div className="mt-6 flex-1 rounded-xl overflow-hidden">
                      <img
                        src="https://framerusercontent.com/images/rKC5E60GAiNNslxdW25Nyc5ulpk.png"
                        alt="AI Apps"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="h-[400px] rounded-3xl bg-neutral-50 p-6 flex flex-col">
                    <div className="space-y-4">
                      <h6 className="text-xl font-semibold text-[#070C03]">
                        Integration
                      </h6>
                      <p className="text-[#657084]">
                        Design better and spend less time without restricting
                        creative freedom. Design better and spend less time
                        without restricting.
                      </p>
                    </div>
                    <div className="mt-6 flex-1 rounded-xl overflow-hidden">
                      <img
                        src="https://framerusercontent.com/images/usjR9rq2F1c3NFRR5vL7QNWbYW0.png"
                        alt="Integration"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Full width card */}
                  <div className="col-span-1 md:col-span-2 h-[500px] rounded-3xl bg-neutral-50 p-6 flex flex-col">
                    <div className="space-y-4">
                      <h6 className="text-xl font-semibold text-[#070C03]">
                        Sync customer data
                      </h6>
                      <p className="text-[#657084]">
                        Know your customers worth, deal stage, etc. Sync
                        customer data from your CRM and CS tools seamlessly.
                      </p>
                    </div>
                    <div className="mt-6 flex-1 rounded-xl overflow-hidden">
                      <img
                        src="https://framerusercontent.com/images/hWBEUD1iP5MEtMk3hwxwxO95zXI.png"
                        alt="Customer Data"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <PricingSection />

          {/* Review Section */}
          <ReviewSection />

          {/* FAQ Section */}
          <FAQSection />

          {/* Newsletter Section */}
          <NewsletterSection />

          {/* Footer */}
          <footer className="bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-xl text-green-600 mb-4">
                    WhatsApp Bulk
                  </h3>
                  <p className="text-gray-600">
                    Professional bulk messaging solution for businesses.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Product</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        API
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Careers
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Terms
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Security
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
                <p> 2024 WhatsApp Bulk. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
