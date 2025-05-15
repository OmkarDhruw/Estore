import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import CartDrawer from '../cart/CartDrawer';

const Navbar: React.FC = () => {
  const { items, totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Announcement Bar */}
      <div className="bg-indigo-600 text-white px-4 py-2 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap">
          Use code for 25% off | Free shipping Use code for 25% off | Free shipping Use code for 25% off | Free shipping
        </div>
      </div>
      
      <nav className="w-full max-w-full px-4 md:px-8 py-2 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-8">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center mr-2">
            <ShoppingCart className="mr-2 text-indigo-600" />
            <span>WorthSkin</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 flex-shrink-0">
            <Link to="/" onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }} className="hover:text-indigo-600 transition-colors">Home</Link>
            {/* Skins Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center hover:text-indigo-600 transition-colors"
                onClick={() => toggleDropdown('skins')}
              >
                Skins <ChevronDown size={16} className="ml-1" />
              </button>
              <div className={`absolute top-full left-0 bg-white shadow-lg rounded-md py-2 w-48 transition-all duration-200 ${activeDropdown === 'skins' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <Link 
                  to="/products/explore-skins" 
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setActiveDropdown(null)}
                >
                  Explore Skins
                </Link>
                <Link 
                  to="/products/mobile-skins" 
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setActiveDropdown(null)}
                >
                  Mobile Skins
                </Link>
                <Link 
                  to="/products/laptop-skins" 
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setActiveDropdown(null)}
                >
                  Laptop Skins
                </Link>
              </div>
            </div>
            {/* Clothing Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center hover:text-indigo-600 transition-colors"
                onClick={() => toggleDropdown('clothing')}
              >
                Clothing <ChevronDown size={16} className="ml-1" />
              </button>
              <div className={`absolute top-full left-0 bg-white shadow-lg rounded-md py-2 w-48 transition-all duration-200 ${activeDropdown === 'clothing' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <Link 
                  to="/products/explore-clothing" 
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setActiveDropdown(null)}
                >
                  Explore Clothing
                </Link>
                <Link 
                  to="/products/mens-collection" 
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setActiveDropdown(null)}
                >
                  Men's Collection
                </Link>
                <Link 
                  to="/products/womens-collection" 
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setActiveDropdown(null)}
                >
                  Women's Collection
                </Link>
              </div>
            </div>
            <Link to="/" onClick={(e) => { 
              e.preventDefault();
              const featuredSection = document.getElementById('featured-products');
              if (featuredSection) {
                const elementRect = featuredSection.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
                window.scrollTo({ top: middle, behavior: 'smooth' });
              }
            }} className="hover:text-indigo-600 transition-colors">Deals</Link>
            <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </div>

          {/* Action Icons */}
          <div className={`flex items-center gap-2 md:gap-3 flex-shrink-0`}>
            {/* Search Icon - always visible */}
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={toggleSearch}
              aria-label="Search"
              style={{marginRight: isSearchOpen ? 0 : 0}}
            >
              <Search size={20} />
            </button>

            {/* Inline Search Bar for desktop, right next to icon */}
            {isSearchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="hidden sm:flex items-center bg-gray-100 rounded-full px-3 py-1 w-[180px] md:w-[240px] lg:w-[260px] xl:w-[300px]"
                style={{marginRight: 8}}
              >
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, more"
                  className="w-full bg-transparent outline-none py-1 text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  className="ml-1 p-1 rounded-full hover:bg-gray-200"
                  onClick={() => setIsSearchOpen(false)}
                  tabIndex={0}
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </form>
            )}

            {/* Mobile Popup Search Bar */}
            {isSearchOpen && (
              <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 sm:hidden">
                <div className="w-full px-4 pt-8">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center bg-white rounded-full px-3 py-2 w-full max-w-md mx-auto shadow-lg"
                  >
                    <input
                      id="search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products, brands, more"
                      className="w-full bg-transparent outline-none py-1 text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="ml-1 p-1 rounded-full hover:bg-gray-200"
                      onClick={() => setIsSearchOpen(false)}
                      tabIndex={0}
                      aria-label="Close search"
                    >
                      <X size={18} />
                    </button>
                  </form>
                </div>
              </div>
            )}

            <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full relative">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/auth" className="p-2 hover:bg-gray-100 rounded-full order-3">
              <User size={20} />
            </Link>
            <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full relative order-4">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full ml-2 order-5"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                closeDropdowns();
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-4 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <Link to="/" className="text-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                  WorthSkin
                </Link>
                <div className="flex items-center gap-2">
                  {/* Mobile Search Button */}
                  <button
                    className="inline-flex items-center p-2 hover:bg-gray-100 rounded-full"
                    onClick={() => {
                      setIsSearchOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    aria-label="Search"
                  >
                    <Search size={22} />
                  </button>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <Link to="/" onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }} className="block py-2 hover:text-indigo-600">
                  Home
                </Link>
                
                {/* Mobile Skins Menu */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Skins</h3>
                  <div className="pl-4 space-y-2">
                    <Link to="/products/explore-skins" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                      Explore Skins
                    </Link>
                    <Link to="/products/mobile-skins" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                      Mobile Skins
                    </Link>
                    <Link to="/products/laptop-skins" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                      Laptop Skins
                    </Link>
                  </div>
                </div>

                {/* Mobile Clothing Menu */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Clothing</h3>
                  <div className="pl-4 space-y-2">
                    <Link to="/products/explore-clothing" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                      Explore Clothing
                    </Link>
                    <Link to="/products/mens-collection" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                      Men's Collection
                    </Link>
                    <Link to="/products/womens-collection" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                      Women's Collection
                    </Link>
                  </div>
                </div>

                <Link to="/" onClick={(e) => { 
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    const featuredSection = document.getElementById('featured-products');
                    if (featuredSection) {
                      const elementRect = featuredSection.getBoundingClientRect();
                      const absoluteElementTop = elementRect.top + window.pageYOffset;
                      const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
                      window.scrollTo({ top: middle, behavior: 'smooth' });
                    }
                  }, 300);
                }} className="block py-2 hover:text-indigo-600">
                  Deals
                </Link>
                <Link to="/contact" className="block py-2 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Navbar;