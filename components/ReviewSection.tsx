import React from 'react';
import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-48 cursor-pointer overflow-hidden rounded-xl border p-3",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-1.5">
        <img className="rounded-full w-6 h-6" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-xs font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-[10px] font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-1.5 text-xs">{body}</blockquote>
    </figure>
  );
};

const ReviewSection = () => {
  return (
    <section className="py-12 relative">
      <div className="flex flex-col items-center px-4">



           {/* Image with overlay */}
           <div className="relative w-[300px] sm:w-[396px] h-[280px] sm:h-[371px]">
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <img 
              src="https://framerusercontent.com/images/6EonuwGFGKNwGxhB4fHWPBIfXc.svg" 
              alt="Background Pattern" 
              className="w-full h-full object-cover"
            />
            <div className="absolute  inset-0 bg-gradient-to-b from-white/5 to-white/20 mix-blend-overlay"></div>
          </div>
        </div>
        {/* Pill title */}
        <div className="mb-4">
          <div className="px-3 py-1.5 bg-white rounded-full border border-[#eaeaea] shadow-[0_-4px_16px_0_rgba(159,232,112,0.1)_inset]">
            <p className="text-[#070C03] text-xs sm:text-sm font-medium">Sweet words of love</p>
          </div>
        </div>

        {/* Main title */}
        <div className="text-center mb-6">
          <h2 className="text-[#070C03] text-2xl sm:text-4xl font-semibold mb-2 sm:mb-4">
            What Our Users Say
          </h2>
          <p className="text-[#657084] text-base sm:text-lg">
            Join thousands of satisfied users who trust our platform
          </p>
        </div>

     

        {/* Marquee section */}
        <div className="container mx-auto px-2 mt-12">
          {/* Marquee Reviews */}
          <div className="relative">
            <Marquee pauseOnHover className="[--duration:20s]">
              {firstRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
              {secondRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
