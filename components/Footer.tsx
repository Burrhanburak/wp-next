import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  products: [
    { name: "Product", href: "/product" },
    { name: "Community edition", href: "#" },
    { name: "Enterprise edition", href: "#" },
    { name: "Marketplace", href: "#" },
    { name: "Cloud", href: "#" },
  ],
  platform: [
    { name: "Pricing", href: "/pricing" },
    { name: "Dashboard", href: "#" },
    { name: "DevTools", href: "#" },
    { name: "Starter kit", href: "#" },
  ],
  features: [
    { name: "Encrypt credentials", href: "#" },
    { name: "Dynamic zones", href: "#" },
    { name: "Fields", href: "#" },
  ],
  developers: [
    { name: "Documentation", href: "#" },
    { name: "Tutorial", href: "#" },
    { name: "Guides", href: "#" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact us", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: "/icons/twitter.svg", href: "#" },
  { icon: "/icons/github.svg", href: "#" },
  { icon: "/icons/discord.svg", href: "#" },
];

export function Footer() {
  return (
    <footer className="w-full px-4 py-12 md:py-16 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8">
        {/* Logo and Social Section */}
        <div className="col-span-2">
          <Link href="/" className="block mb-8">
            <Image src="/logo.svg" alt="Logo" width={120} height={30} />
          </Link>
          <div className="flex space-x-4 mb-8">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-100 bg-[#FAFAFA] hover:bg-zinc-50 transition-colors"
              >
                <Image src={social.icon} alt="social" width={16} height={16} />
              </a>
            ))}
          </div>
          <p className="text-sm text-[#657084]">
            2024, WhatsApp Bulk Template
          </p>
        </div>

        {/* Links Sections */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="col-span-1">
            <h3 className="text-sm font-semibold text-[#404042] mb-4 capitalize">
              {category}
            </h3>
            <ul className="space-y-3">
              {links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#657084] hover:text-[#070C03] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
