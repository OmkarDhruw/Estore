import React from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/ui/Banner';
import { getCategoryCollections } from '../data/categories';
import { getFeaturedProducts } from '../data/products';
import ProductGrid from '../components/ui/ProductGrid';

const CategoriesPage: React.FC = () => {
  const collections = getCategoryCollections();
  const trendingProducts = getFeaturedProducts(8);
  
  return (
    <div>
      <Banner 
        title="Mobile Skins Collections" 
        subtitle="Find the perfect skin for your device" 
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Categories Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div key={collection.id} className="group">
              <Link 
                to={`/products/${collection.slug}`}
                className="block relative overflow-hidden rounded-lg bg-gray-100"
              >
                <img 
                  src={collection.image}
                  alt={collection.name}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-2">{collection.name}</h3>
                    <span className="inline-flex items-center text-white text-sm">
                      Shop Now 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Custom Skin Design */}
        <div className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Create Your Own Design</h2>
              <p className="text-white/90 mb-6">
                Unleash your creativity with our custom skin designer. Upload your image or design
                and we'll create a unique skin just for you.
              </p>
              <Link 
                to="/custom-design"
                className="inline-block bg-white text-indigo-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors w-fit"
              >
                Design Your Skin
              </Link>
            </div>
            <div className="bg-indigo-400 flex items-center justify-center p-8">
              <img 
                src="https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Custom Mobile Skin Design"
                className="max-h-60 object-contain"
              />
            </div>
          </div>
        </div>
        
        {/* Trending Products */}
        <div className="mt-16">
          <ProductGrid products={trendingProducts} title="Trending Mobile Skins" />
        </div>
        
        {/* How It Works */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 text-xl font-bold">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Choose Your Skin</h3>
              <p className="text-gray-600">
                Browse our collection and select a skin that matches your style
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 text-xl font-bold">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Place Your Order</h3>
              <p className="text-gray-600">
                Select your device model and complete your purchase
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 text-xl font-bold">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Apply & Enjoy</h3>
              <p className="text-gray-600">
                Receive your custom skin and follow our easy application guide
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage; 