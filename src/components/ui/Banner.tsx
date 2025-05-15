import React from 'react';

interface BannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle, backgroundImage }) => {
  return (
    <div
      className="relative h-64 w-full overflow-hidden bg-gray-900"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-lg text-gray-200">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default Banner; 