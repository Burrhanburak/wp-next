import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, XIcon } from '@heroicons/react/solid';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
  billingPeriod: 'monthly' | 'yearly' | 'one-time';
}

export default function PackageManager() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/billing/packages');
      if (!response.ok) throw new Error('Failed to fetch packages');
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId: string) => {
    try {
      const response = await fetch('/api/billing/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          billingPeriod: selectedBilling,
        }),
      });

      if (!response.ok) throw new Error('Failed to process purchase');
      
      // Handle successful purchase (e.g., redirect to payment page)
      const data = await response.json();
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Error processing purchase:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="relative bg-gray-100 p-1 rounded-lg">
          <button
            className={`relative px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedBilling === 'monthly'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setSelectedBilling('monthly')}
          >
            Monthly
          </button>
          <button
            className={`relative px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedBilling === 'yearly'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setSelectedBilling('yearly')}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence>
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                pkg.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                  Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-gray-500 mb-6">{pkg.description}</p>

                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${selectedBilling === 'yearly' ? (pkg.price * 0.8).toFixed(2) : pkg.price}
                  </span>
                  <span className="text-gray-500 ml-2">
                    /{selectedBilling === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(pkg.id)}
                  className={`w-full py-3 px-6 rounded-lg text-center font-medium transition-colors ${
                    pkg.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Additional Information */}
      <div className="mt-12 text-center">
        <p className="text-gray-500">
          All plans include 24/7 support, 99.9% uptime guarantee, and automatic backups.
        </p>
        <p className="text-gray-500 mt-2">
          Need a custom plan? <a href="#" className="text-blue-600 hover:underline">Contact us</a>
        </p>
      </div>
    </div>
  );
}
