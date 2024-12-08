import React from 'react';

const NewsletterSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative bg-[#fafafa] rounded-[20px] p-8 md:p-12 overflow-hidden">
          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-8">
              <h2 className="text-[#070C03] text-3xl font-semibold mb-4">
                Subscribe to our newsletter
              </h2>
              <p className="text-[#657084]">
                Subscribe to our newsletter and never miss our latest news.
              </p>
            </div>

            {/* Form Section */}
            <div className="space-y-4">
              <h4 className="text-[#163300] font-medium">Enter Your E-Mail Adress</h4>
              <form className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="E-Mail Address"
                    className="w-full px-6 py-4 rounded-full border border-[#E6E9EE] bg-white text-[#070C03] placeholder-[#657084] focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-[#9FE870] rounded-full py-4 px-8 font-medium hover:bg-gray-900 transition-colors"
                >
                  Get started
                </button>
              </form>
            </div>
          </div>

          {/* Pattern Background */}
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 opacity-60"
              style={{
                background: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23000000' fill-opacity='0.1'/%3E%3C/svg%3E") repeat`
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: "radial-gradient(53.6806% 53.6806% at 50% 46.3194%, rgba(250, 250, 250, 0) 9.45723%, rgb(250, 250, 250) 100%)"
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;