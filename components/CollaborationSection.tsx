import Image from 'next/image';

const CollaborationSection = () => {
  const features = [
    {
      title: "Live Document Editing",
      description: "Simultaneously Collaborate on Projects.",
      image: "https://framerusercontent.com/images/QPijNLOrqFJAMCNevqn7cLzZSfM.webp",
      largeCard: true
    },
    {
      title: "Live Document Editing",
      description: "Simultaneously Collaborate on Projects.",
      image: "https://framerusercontent.com/images/TyDCMWqjhhXToICUuinULqDGlQ.png"
    },
    {
      title: "Collaborative Workspaces",
      description: "Shared Spaces for Effortless Team Collaboration",
      image: "https://framerusercontent.com/images/bm9JV0LpKXRlCuftYGBOz1IIyc0.webp"
    },
    {
      title: "Instant Communication",
      description: "Stay Connected with Real-Time Messaging and Notifications",
      image: "https://framerusercontent.com/images/twn8vj6LRYZkWT7ZNaTFbupEyk.png",
      largeCard: true
    }
  ];

  return (
    <div className="w-full max-w-[1068px] mx-auto px-4 sm:px-6">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-16 space-y-4">
        <div className="inline-flex px-4 py-2 bg-white rounded-full border border-gray-200 shadow-[0_-4px_16px_rgba(159,232,112,0.1)_inset]">
          <span className="text-[#070C03]">Features</span>
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#070C03]">Real-time collaboration</h2>
          <p className="text-[#5B5F59] text-sm md:text-base max-w-[280px] md:max-w-[480px] mx-auto mt-3 leading-relaxed">
            Empower your team to work together seamlessly with real-time collaboration tools that foster efficient communication and productivity.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl border border-[#EBECEB] shadow-[0px_4px_7px_rgba(0,0,0,0.03)] overflow-hidden
              ${feature.largeCard ? 'md:col-span-2' : ''}`}
          >
            <div className="p-4 md:p-6 space-y-2">
              <h3 className="text-lg md:text-xl font-semibold text-[#070C03]">{feature.title}</h3>
              <p className="text-sm md:text-base text-[#6A6D68]">{feature.description}</p>
            </div>
            <div className={`relative ${feature.largeCard ? 'h-[160px] md:h-[200px]' : 'h-[120px] md:h-[150px]'}`}>
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, (max-width: 1068px) 50vw, 1068px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationSection;
