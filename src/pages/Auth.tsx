import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthCard } from '../components/auth/AuthCard';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { SocialAuth } from '../components/auth/SocialAuth';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full max-w-md"
        >
          <AuthCard
            title={isLogin ? 'Welcome Back!' : 'Create Account'}
            isLogin={isLogin}
            onToggle={() => setIsLogin(!isLogin)}
          >
            {isLogin ? <LoginForm /> : <SignupForm />}
            <SocialAuth />
          </AuthCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 