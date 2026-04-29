import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon, Bars3Icon, XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { selectIsAuthenticated, selectCurrentUser, logout as authLogout } from '@store/slices/authSlice';
import { selectShortlistCount } from '@store/slices/shortlistSlice';
import { toggleMobileMenu, selectIsMobileMenuOpen } from '@store/slices/uiSlice';
import { useLogoutMutation } from '@store/api/authApi';

const NAV_LINKS = [
  { label: 'Properties', href: '/properties' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const shortlistCount = useSelector(selectShortlistCount);
  const mobileMenuOpen = useSelector(selectIsMobileMenuOpen);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.warn('Logout failed, forcing local cleanup');
    } finally {
      dispatch(authLogout());
      setUserMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white border-b border-gray-100 ${scrolled ? 'shadow-sm' : ''}`} style={{ height: '80px' }}>
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <span className="text-[24px] font-extrabold tracking-tight text-[#111111]">RealEstate</span>
        </Link>

        {/* Center: Nav Links */}
        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-[15px] font-medium transition-colors ${
                location.pathname.startsWith(link.href)
                  ? 'text-[#111111] font-bold'
                  : 'text-[#555555] hover:text-[#111111]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          {/* Wishlist */}
          <Link
            to={isAuthenticated ? '/dashboard/shortlist' : '/auth/login'}
            className="text-[#111111] hover:scale-110 transition-transform relative hidden sm:block"
          >
            {shortlistCount > 0 ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
            {shortlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full" />
            )}
          </Link>

          {!isAuthenticated && (
            <Link
              to="/auth/login"
              className="hidden sm:block text-[14px] font-medium text-[#555555] hover:text-[#111111] transition-colors"
            >
              Sign In
            </Link>
          )}

          <Link
            to="/contact"
            className="hidden sm:flex items-center px-5 py-2 bg-[#111111] text-white text-[13px] font-semibold rounded-full hover:bg-black transition-colors"
          >
            Contact Us
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((p) => !p)}
                className="flex items-center gap-2 text-[#111111] hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 rounded-full bg-[#111111] flex items-center justify-center">
                  <span className="text-white font-bold text-sm uppercase">{user?.name?.[0] || 'U'}</span>
                </div>
                <ChevronDownIcon className="w-4 h-4 hidden sm:block" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-5 py-4 border-b border-gray-50">
                      <p className="text-sm font-bold text-[#111111] truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                    </div>
                    {[
                      { label: 'Dashboard', href: '/dashboard' },
                      { label: 'My Inquiries', href: '/dashboard/enquiries' },
                      { label: 'Profile Settings', href: '/dashboard/profile' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-5 py-3 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-[#111111] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}

          {/* Mobile toggle */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="lg:hidden text-[#111111] p-2"
          >
            {mobileMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full inset-x-0 bg-white border-t border-gray-100 shadow-2xl overflow-hidden p-8 space-y-8"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => dispatch(toggleMobileMenu())}
                  className="text-xl font-bold text-[#111111]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="pt-8 border-t border-gray-100 flex flex-col gap-4">
                <Link to="/auth/login" onClick={() => dispatch(toggleMobileMenu())} className="text-center py-4 text-[#111111] font-bold rounded-2xl border border-gray-200">
                  Sign In
                </Link>
                <Link to="/contact" onClick={() => dispatch(toggleMobileMenu())} className="text-center py-4 bg-[#111111] text-white font-bold rounded-2xl">
                  Contact Us
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}