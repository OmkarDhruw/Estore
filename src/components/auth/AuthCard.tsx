import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  onToggle: () => void;
  isLogin: boolean;
}

export const AuthCard = ({ children, title, onToggle, isLogin }: AuthCardProps) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-xl w-full mx-auto p-4 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {title}
      </motion.h2>
      {children}
      <div className="mt-4 md:mt-6 text-center">
        <button
          onClick={onToggle}
          className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </motion.div>
  );
}; 