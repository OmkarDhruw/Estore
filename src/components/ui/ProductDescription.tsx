import React from 'react';

interface ProductDescriptionProps {
  description: string;
  categoryType: 'skin' | 'clothing';
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description, categoryType }) => {
  // Default descriptions based on category type
  const getDefaultFeatures = () => {
    if (categoryType === 'skin') {
      return [
        'Premium 3M vinyl material with scratch-resistant coating',
        'Precision-cut for a perfect fit on your device model',
        'Bubble-free application and residue-free removal',
        'Ultra-thin design preserves the sleek profile of your device',
        'Vibrant, high-definition printing that won\'t fade',
      ];
    } else {
      return [
        'Made from high-quality cotton blends for maximum comfort',
        'Durable stitching that lasts wash after wash',
        'Vibrant colors that won\'t fade easily',
        'Designed for a perfect fit and stylish look',
        'Eco-friendly manufacturing process',
      ];
    }
  };
  
  const getDefaultDescription = () => {
    if (categoryType === 'skin') {
      return "Our premium quality skins are made from durable vinyl material that ensures long-lasting protection and a sleek finish for your device. Each skin is precision-cut for a perfect fit and easy application.";
    } else {
      return "Made from high-quality cotton blends, our clothing collection offers comfort, durability, and a perfect fit for every occasion. Each piece is carefully crafted to ensure long-lasting wear while maintaining style.";
    }
  };
  
  return (
    <div className="product-description">
      <h2 className="text-2xl font-bold text-gray-900">Product Description</h2>
      
      <div className="mt-4 prose prose-indigo max-w-none">
        {/* Custom description */}
        <p>{description}</p>
        
        {/* Default description based on category */}
        <p className="mt-4">{getDefaultDescription()}</p>
        
        {/* Features list */}
        <h3 className="mt-6 text-lg font-medium">Key Features:</h3>
        <ul className="mt-2 space-y-2">
          {getDefaultFeatures().map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductDescription; 