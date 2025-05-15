import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChange,
  min = 1,
  max = 99,
  step = 1
}) => {
  const increment = () => {
    if (quantity < max) {
      onChange(quantity + step);
    }
  };

  const decrement = () => {
    if (quantity > min) {
      onChange(quantity - step);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    
    if (isNaN(newValue)) {
      onChange(min);
    } else {
      // Clamp the value between min and max
      const clampedValue = Math.min(Math.max(newValue, min), max);
      onChange(clampedValue);
    }
  };

  return (
    <div className="inline-flex items-center">
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={decrement}
        disabled={quantity <= min}
        className="p-2 rounded-l-lg border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:hover:bg-gray-50"
      >
        <Minus size={16} />
      </motion.button>
      
      <input
        type="text"
        value={quantity}
        onChange={handleChange}
        aria-label="Quantity"
        className="w-14 border-y border-gray-300 py-2 text-center text-gray-900 text-sm focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={increment}
        disabled={quantity >= max}
        className="p-2 rounded-r-lg border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:hover:bg-gray-50"
      >
        <Plus size={16} />
      </motion.button>
    </div>
  );
};

export default QuantitySelector; 