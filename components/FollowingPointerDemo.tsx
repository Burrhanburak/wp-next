'use client';
import Image from "next/image";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

const blogContent = {
  slug: "whatsapp-bulk-messaging",
  author: "WhatsApp Team",
  date: "Latest Update",
  title: "WhatsApp Bulk Messaging Guide",
  description:
    "Learn how to effectively use WhatsApp bulk messaging for your business while maintaining high engagement rates and avoiding spam filters.",
  image: "/2.png",
  authorAvatar: "/4.png",
};

export function FollowingPointerDemo() {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <FollowerPointerCard
        title={
          <TitleComponent
            title={blogContent.author}
            avatar={blogContent.authorAvatar}
          />
        }
      >
        <div className="relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100">
          <div className="w-full aspect-w-16 aspect-h-10 bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
            <Image
              src={blogContent.image}
              alt={blogContent.title}
              fill
              className="group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200"
            />
          </div>
          <div className="p-4">
            <h2 className="font-bold my-4 text-lg text-zinc-700">
              {blogContent.title}
            </h2>
            <h2 className="font-normal my-4 text-sm text-zinc-500">
              {blogContent.description}
            </h2>
            <div className="flex flex-row justify-between items-center mt-6">
              <span className="text-sm text-gray-500">{blogContent.date}</span>
              <button className="relative z-10 px-6 py-2 bg-primary hover:bg-primary-hover text-white hover:text-primary font-bold rounded-xl block text-xs transition-colors duration-200">
                Read More
              </button>
            </div>
          </div>
        </div>
      </FollowerPointerCard>
    </div>
  );
}

const TitleComponent = ({
  title,
  avatar,
}: {
  title: string;
  avatar: string;
}) => (
  <div className="flex items-center gap-2">
    <Image
      src={avatar}
      height={20}
      width={20}
      alt={`${title}'s avatar`}
      className="rounded-full border-2 border-white"
    />
    <p className="text-sm font-medium text-zinc-700">{title}</p>
  </div>
);

export default FollowingPointerDemo;
