import Image from 'next/image';

const AutoScalingFeatures = () => {
  const features = [
    {
      icon: "https://framerusercontent.com/images/EN1bCnLOJUbXKwdb8hyF67WFTOU.svg",
      title: "Dynamic Scaling",
      description: "Automated Infrastructure that Grows with Your Demands"
    },
    {
      icon: "https://framerusercontent.com/images/PKnXe4lbtkf17swhgwNQCwmh0g.svg",
      title: "Cost Efficiency",
      description: "Easily optimized Performance without Overspending"
    },
    {
      icon: "https://framerusercontent.com/images/D7z1lgeq2T8tglpX62vLBGrkR8.svg",
      title: "Seamless Performance",
      description: "Consistent and Reliable Even During Peak Loads"
    },
    {
      icon: "https://framerusercontent.com/images/wgGnxYN8zULiIS5qdbrU0cYZQg.svg",
      title: "Resource Optimization",
      description: "Use Resources Efficiently for Maximum Productivity"
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-16 w-full bg-[#fcfaf5] rounded-[20px] p-6 lg:p-20 overflow-visible">
      {/* Left Section - Content */}
      <div className="flex flex-col gap-4 w-full lg:max-w-[480px]">
        <div className="space-y-4">
          <div className="inline-flex px-4 py-2 bg-white rounded-full border border-gray-200 shadow-[0_-4px_16px_rgba(159,232,112,0.1)_inset]">
            <span className="text-[#070C03]">Features</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#070C03]">Auto-scaling infrastructure</h2>
          <p className="text-[#5B5F59] text-base lg:text-lg">
            Seamlessly adapt to varying workloads with our cloud solutions automated scaling, ensuring optimal performance and cost efficiency.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-[62px] mt-8">
          {features.map((feature, index) => (
            <div key={index} className="space-y-2">
              <Image
                src={feature.icon}
                alt={feature.title}
                width={24}
                height={24}
                className="mb-2"
              />
              <h4 className="font-semibold text-[#343830]">{feature.title}</h4>
              <p className="text-[#6A6D68] text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-full lg:flex-1 mt-8 lg:mt-0">
        <div className="relative w-full">
          <Image
            src="https://framerusercontent.com/images/jiRUNzHkM8hJPWB1qnG5Spwc4VQ.webp"
            alt="Auto-scaling Infrastructure"
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default AutoScalingFeatures;
