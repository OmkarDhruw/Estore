import React from 'react';
import { Truck, RotateCw, Shield, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureIcons: React.FC = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'Free Shipping',
      description: 'On orders above ₹398'
    },
    {
      icon: <RotateCw className="h-6 w-6" />,
      title: 'Easy Returns',
      description: '10 day return policy'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Checkout',
      description: '100% protected payments'
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Payment Options',
      description: 'COD, Cards, UPI, EMI'
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {features.map((feature, index) => (
        <motion.div 
          key={index}
          variants={item}
          className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg"
        >
          <div className="w-12 h-12 mb-3 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            {feature.icon}
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">{feature.title}</h3>
          <p className="text-xs text-gray-500">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureIcons; 