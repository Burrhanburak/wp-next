import React from "react";

const PartnerCarousel = () => {
  const partners = [
    "https://framerusercontent.com/images/m7PNpXCbG8iZEnciSeCey3SyVA.svg",
    "https://framerusercontent.com/images/2ab9Ea9KKj0lb6euRGHVqGrvMY.svg",
    "https://framerusercontent.com/images/6YEKQwYSh0KOPDuS8cngrHmhg.svg",
    "https://framerusercontent.com/images/1n0R5vCmpO7UQHuGybKMWNhGGhs.svg",
    "https://framerusercontent.com/images/CXn64zLMP0Xd3fVHt96JbJUocS8.svg",
  ];

  // Triple the array to ensure smooth continuous scrolling
  const extendedPartners = [...partners, ...partners, ...partners];

  return (
    <div className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          {/* Left Mask */}
          <div className="absolute left-0 top-0 w-32 h-full z-10 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none" />
          
          {/* Right Mask */}
          <div className="absolute right-0 top-0 w-32 h-full z-10 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none" />

          {/* Carousel Track */}
          <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee flex items-center space-x-16 whitespace-nowrap">
              {extendedPartners.map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24"
                >
                  <img
                    src={logo}
                    alt={`Partner Logo ${index + 1}`}
                    className="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          min-width: fit-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 20s;
          }
        }
      `}</style>
    </div>
  );
};

export default PartnerCarousel;
