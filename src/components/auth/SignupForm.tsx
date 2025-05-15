import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { SignupFormData } from '../../types';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  verificationCode: z.string().length(6, 'Verification code must be 6 digits').optional(),
});

export const SignupForm = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const sendVerificationCode = async () => {
    const phone = getValues('phone');
    try {
      // Here you would integrate with your SMS service
      console.log('Sending verification code to:', phone);
      setCodeSent(true);
      setIsVerifying(true);
    } catch (error) {
      console.error('Error sending code:', error);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    if (!isVerifying) {
      await sendVerificationCode();
      return;
    }
    try {
      console.log('Signup data:', data);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div>
          <input
            {...register('username')}
            type="text"
            placeholder="Name"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.username.message}</span>
          )}
        </div>

        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div>
          <input
            {...register('phone')}
            type="tel"
            placeholder="Phone number (with country code)"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </div>

        <div>
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        {isVerifying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <input
              {...register('verificationCode')}
              type="text"
              placeholder="Enter 6-digit verification code"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.verificationCode && (
              <span className="text-red-500 text-sm">{errors.verificationCode.message}</span>
            )}
          </motion.div>
        )}
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {isVerifying ? 'Create Account' : 'Send Verification Code'}
      </motion.button>

      {codeSent && (
        <p className="text-sm text-gray-600 text-center">
          Verification code sent! Please check your phone.
        </p>
      )}
    </form>
  );
}; 