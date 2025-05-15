import { FaGoogle, FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const socialProviders = [
  { id: 'google', icon: FaGoogle },
  { id: 'facebook', icon: FaFacebook },
  { id: 'github', icon: FaGithub },
  { id: 'linkedin', icon: FaLinkedin }
];

export const SocialAuth = () => {
  const handleSocialLogin = async (providerId: string) => {
    try {
      console.log(`Logging in with ${providerId}`);
    } catch (error) {
      console.error(`${providerId} login error:`, error);
    }
  };

  return (
    <div className="mt-4 md:mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500 text-xs md:text-sm">
            or use your email for registration
          </span>
        </div>
      </div>

      <div className="mt-4 md:mt-6 flex justify-center gap-3 md:gap-4">
        {socialProviders.map(({ id, icon: Icon }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSocialLogin(id)}
            className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <Icon className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}; 