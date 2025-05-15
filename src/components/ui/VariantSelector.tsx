import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

interface VariantSelectorProps {
  type: string;
  options: string[];
  selected: string;
  onChange: (option: string) => void;
}

// Mobile brands and their models
const MOBILE_BRANDS = {
  'Apple iPhone': [
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
    'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
    'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 Mini',
    'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 Mini',
    'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11'
  ],
  'Samsung': [
    'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
    'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
    'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21',
    'Galaxy Note 20 Ultra', 'Galaxy Note 20',
    'Galaxy A54', 'Galaxy A53', 'Galaxy A52'
  ],
  'OnePlus': [
    'OnePlus 11', 'OnePlus 10 Pro', 'OnePlus 10T',
    'OnePlus 9 Pro', 'OnePlus 9', 'OnePlus 9R',
    'OnePlus 8 Pro', 'OnePlus 8', 'OnePlus 8T',
    'OnePlus Nord 3', 'OnePlus Nord 2', 'OnePlus Nord'
  ],
  'Xiaomi': [
    'Redmi Note 12 Pro+', 'Redmi Note 12 Pro', 'Redmi Note 12',
    'Redmi Note 11 Pro+', 'Redmi Note 11 Pro', 'Redmi Note 11',
    'Mi 12 Pro', 'Mi 12', 'Mi 11 Ultra', 'Mi 11'
  ],
  'Vivo': [
    'Vivo X90 Pro', 'Vivo X80 Pro', 'Vivo X80',
    'Vivo V27 Pro', 'Vivo V27', 'Vivo V25 Pro', 'Vivo V25',
    'Vivo Y100', 'Vivo Y75'
  ],
  'OPPO': [
    'OPPO Find X6 Pro', 'OPPO Find X6', 'OPPO Find X5 Pro', 'OPPO Find X5',
    'OPPO Reno 10 Pro+', 'OPPO Reno 10 Pro', 'OPPO Reno 10',
    'OPPO F23', 'OPPO F21 Pro'
  ],
  'Nothing': [
    'Nothing Phone (2)', 'Nothing Phone (1)'
  ],
  'Google': [
    'Pixel 7 Pro', 'Pixel 7', 'Pixel 6 Pro', 'Pixel 6'
  ]
};

const WRAP_OPTIONS = [
  'Full Body Wrap (Cover Sides & Edges)',
  'Only Back (No Sides)'
];

const LOGO_OPTIONS = [
  'With Logo Cut',
  'Without Logo Cut'
];

const VariantSelector: React.FC<VariantSelectorProps> = ({
  type,
  options,
  selected,
  onChange
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedWrapType, setSelectedWrapType] = useState<string>('');
  const [selectedLogoOption, setSelectedLogoOption] = useState<string>('');
  const [isPhoneSkin, setIsPhoneSkin] = useState(false);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  
  // Check if this is a phone skin product
  useEffect(() => {
    if (type.toLowerCase().includes('mobile') || type.toLowerCase().includes('phone')) {
      setIsPhoneSkin(true);
      // Set default brand if brands are in options
      if (options.length > 0 && Object.keys(MOBILE_BRANDS).includes(options[0])) {
        setSelectedBrand(options[0]);
      }
    }
  }, [type, options]);
  
  // Update the composite selection when subselections change
  useEffect(() => {
    if (isPhoneSkin && selectedBrand && selectedModel && selectedWrapType && selectedLogoOption) {
      onChange(`${selectedModel} - ${selectedWrapType} - ${selectedLogoOption}`);
    }
  }, [selectedBrand, selectedModel, selectedWrapType, selectedLogoOption, isPhoneSkin, onChange]);

  // Scroll to show the next selection when a choice is made
  useEffect(() => {
    if (!optionsContainerRef.current) return;
    
    // On brand select, scroll to model selector
    if (selectedBrand && !selectedModel) {
      setTimeout(() => {
        const brandElement = optionsContainerRef.current?.querySelector('.brand-selector');
        const modelElement = optionsContainerRef.current?.querySelector('.model-selector');
        
        if (modelElement && brandElement) {
          const topOffset = modelElement.getBoundingClientRect().top - 
                            brandElement.getBoundingClientRect().top;
          
          optionsContainerRef.current?.scrollBy({
            top: topOffset - 20,
            behavior: 'smooth'
          });
        }
      }, 300);
    }

    // On model select, scroll to logo selector
    if (selectedModel && !selectedLogoOption) {
      setTimeout(() => {
        const modelElement = optionsContainerRef.current?.querySelector('.model-selector');
        const logoElement = optionsContainerRef.current?.querySelector('.logo-selector');
        
        if (modelElement && logoElement) {
          const topOffset = logoElement.getBoundingClientRect().top - 
                            modelElement.getBoundingClientRect().top;
          
          optionsContainerRef.current?.scrollBy({
            top: topOffset - 20,
            behavior: 'smooth'
          });
        }
      }, 300);
    }

    // On logo select, scroll to wrap type selector
    if (selectedLogoOption && !selectedWrapType) {
      setTimeout(() => {
        const logoElement = optionsContainerRef.current?.querySelector('.logo-selector');
        const wrapElement = optionsContainerRef.current?.querySelector('.wrap-selector');
        
        if (logoElement && wrapElement) {
          const topOffset = wrapElement.getBoundingClientRect().top - 
                            logoElement.getBoundingClientRect().top;
          
          optionsContainerRef.current?.scrollBy({
            top: topOffset - 20,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [selectedBrand, selectedModel, selectedLogoOption, selectedWrapType]);

  // Different display styles based on variant type
  const getVariantStyle = () => {
    switch (type.toLowerCase()) {
      case 'color':
        return 'color';
      case 'size':
        return 'size';
      case 'mobilemodel':
      case 'mobile model':
      case 'phone model':
        return 'dropdown';
      default:
        return 'chip';
    }
  };

  const variantStyle = getVariantStyle();

  // Function to get color code from color name (for color variants)
  const getColorCode = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      black: '#000000',
      white: '#ffffff',
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      pink: '#ec4899',
      gray: '#6b7280',
      orange: '#f97316',
      brown: '#92400e',
      navy: '#1e3a8a',
      teal: '#14b8a6',
      olive: '#84cc16',
      maroon: '#be123c',
      silver: '#cbd5e1',
      gold: '#fcd34d',
      beige: '#f5f5dc',
      // Add more colors as needed
    };

    const lcColorName = colorName.toLowerCase();
    
    // Return the color code if it exists in our map, otherwise return a default
    return colorMap[lcColorName] || '#cccccc';
  };

  const getColorLabel = (colorOption: string): string => {
    // If the color name has spaces, return as is
    if (colorOption.includes(' ')) return colorOption;
    
    // Capitalize the first letter
    return colorOption.charAt(0).toUpperCase() + colorOption.slice(1);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  // Render for phone skin specific variants
  if (isPhoneSkin) {
  return (
      <div className="space-y-6">
        {/* Selection progress indicator */}
        <div className="flex mb-2">
          <div className={`flex-1 h-1 rounded-l-full ${selectedBrand ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-1 ${selectedModel ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-1 ${selectedLogoOption ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-1 rounded-r-full ${selectedWrapType ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
        </div>
        
        {/* Make options container scrollable */}
        <div 
          className="p-4 border border-gray-200 rounded-lg max-h-[400px] overflow-y-auto overflow-x-hidden"
          ref={optionsContainerRef}
        >
          {/* Mobile Brand Selector */}
          <div className="mb-4 brand-selector">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Step 1: Select Your Mobile Brand <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel(''); // Reset model when brand changes
                  setSelectedLogoOption(''); // Reset logo option
                  setSelectedWrapType(''); // Reset wrap type
                }}
                className="block w-full rounded-md border border-gray-300 bg-white py-3 px-4 pr-10 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                required
              >
                <option value="" disabled>-- Please select --</option>
                {Object.keys(MOBILE_BRANDS).map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
      </div>
      
          {/* Mobile Model Selector */}
          {selectedBrand && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mb-4 model-selector"
            >
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Step 2: Select Your {selectedBrand} Model <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    setSelectedLogoOption(''); // Reset logo option
                    setSelectedWrapType(''); // Reset wrap type
                  }}
                  className="block w-full rounded-md border border-gray-300 bg-white py-3 px-4 pr-10 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                  required
                >
                  <option value="" disabled>-- Please select --</option>
                  {MOBILE_BRANDS[selectedBrand as keyof typeof MOBILE_BRANDS]?.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Logo Cut Option */}
          {selectedModel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mb-4 logo-selector"
            >
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Step 3: Choose Logo Option <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LOGO_OPTIONS.map((option) => (
            <button
              key={option}
                    onClick={() => {
                      setSelectedLogoOption(option);
                      setSelectedWrapType(''); // Reset wrap type
                    }}
                    className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                      selectedLogoOption === option 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span>{option}</span>
                    {selectedLogoOption === option && (
                      <Check size={18} className="text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Wrap Type Option */}
          {selectedLogoOption && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="wrap-selector"
            >
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Step 4: Choose Coverage Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WRAP_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedWrapType(option)}
                    className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                      selectedWrapType === option 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span>{option}</span>
                    {selectedWrapType === option && (
                      <Check size={18} className="text-indigo-600" />
                    )}
            </button>
          ))}
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Selection Summary */}
        {selectedModel && selectedLogoOption && selectedWrapType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100"
          >
            <h4 className="font-medium text-indigo-800 mb-2">Your Selection Summary:</h4>
            <ul className="space-y-1 text-sm text-indigo-600">
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-0.5" />
                <span><span className="font-medium">Device:</span> {selectedBrand} {selectedModel}</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-0.5" />
                <span><span className="font-medium">Logo Option:</span> {selectedLogoOption}</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-0.5" />
                <span><span className="font-medium">Coverage:</span> {selectedWrapType}</span>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    );
  }

  // Default rendering for other variant types
  return (
    <div className="variant-selector">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          // Color variant
          if (variantStyle === 'color') {
            const colorCode = getColorCode(option);
            const colorLabel = getColorLabel(option);
            
            return (
              <motion.button
                key={option}
                variants={item}
                type="button"
                onClick={() => onChange(option)}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 border transition-all ${
                  selected === option 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={`Select color: ${option}`}
              >
                <span 
                  className="inline-block w-5 h-5 rounded-full border border-gray-300" 
                  style={{ backgroundColor: colorCode }}
                >
                  {selected === option && (
                    <span className="flex h-full items-center justify-center">
                      <Check size={12} className={`${colorCode === '#ffffff' ? 'text-black' : 'text-white'}`} />
                    </span>
                  )}
                </span>
                <span>{colorLabel}</span>
              </motion.button>
            );
          }
          
          // Size variant
          else if (variantStyle === 'size') {
            return (
              <motion.button
                key={option}
                variants={item}
                type="button"
                onClick={() => onChange(option)}
                className={`w-12 h-12 flex items-center justify-center rounded-md border text-sm font-medium transition-all ${
                  selected === option 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                aria-label={`Select size: ${option}`}
              >
                {option}
              </motion.button>
            );
          }
          
          // Default chip style (for other variant types)
          else {
            return (
              <motion.button
                key={option}
                variants={item}
                type="button"
                onClick={() => onChange(option)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selected === option 
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={`Select ${type}: ${option}`}
              >
              {option}
              </motion.button>
            );
          }
        })}
      </motion.div>
    </div>
  );
};

export default VariantSelector; 