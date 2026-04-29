import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon, UserCircleIcon, Bars3Icon, XMarkIcon,
  MagnifyingGlassIcon, ChevronDownIcon, BellIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { selectIsAuthenticated, selectCurrentUser, selectIsAdmin } from '@store/slices/authSlice';
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
  const isAdmin = useSelector(selectIsAdmin);
  const shortlistCount = useSelector(selectShortlistCount);
  const mobileMenuOpen = useSelector(selectIsMobileMenuOpen);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navBg = 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100';
  const textColor = 'text-[#1A1A1A]';

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`} style={{ height: '72px' }}>
      <div className="page-container h-full flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <span className={`font-display font-extrabold text-xl tracking-wider transition-colors ${textColor}`}>RealEstate</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname.startsWith(link.href)
                  ? 'text-[#8C6D45] font-semibold'
                  : `${textColor} hover:text-[#8C6D45]`
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search icon (mobile) */}
          <button
            onClick={() => navigate('/properties')}
            className={`p-2 rounded-lg transition-colors lg:hidden ${textColor} hover:text-gold-500`}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>

          {/* Shortlist */}
          <Link
            to={isAuthenticated ? '/dashboard/shortlist' : '/auth/login'}
            className={`relative p-2 rounded-lg transition-colors ${textColor} hover:text-gold-500`}
          >
            {shortlistCount > 0 ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
            {shortlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-0.5">
                {shortlistCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="hidden lg:flex btn-sm btn-navy text-sm px-4 py-2">
                  Admin
                </Link>
              )}
              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className={`flex items-center gap-2 ${textColor} hover:text-gold-500 transition-colors`}
                >
                  <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user?.name?.[0] || 'U'}</span>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 hidden sm:block" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-card-hover border border-slate-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-navy-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                      {[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Shortlist', href: '/dashboard/shortlist' },
                        { label: 'Enquiries', href: '/dashboard/enquiries' },
                        { label: 'Profile', href: '/dashboard/profile' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-navy-900 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/auth/login" className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${textColor} hover:text-[#8C6D45]`}>
                Sign In
              </Link>
              <Link to="/contact" className="bg-[#1A1A1A] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#2A2A2A] transition-colors shadow-sm">
                Contact Us
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className={`lg:hidden p-2 rounded-lg transition-colors ${textColor}`}
          >
            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-slate-100 shadow-lg overflow-hidden"
          >
            <div className="page-container py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => dispatch(toggleMobileMenu())}
                  className="block px-4 py-3 rounded-xl text-navy-900 font-medium hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <Link to="/auth/login" onClick={() => dispatch(toggleMobileMenu())} className="block text-center py-3 text-navy-900 font-medium rounded-xl border border-slate-200">
                    Sign In
                  </Link>
                  <Link to="/auth/register" onClick={() => dispatch(toggleMobileMenu())} className="block text-center py-3 text-white font-semibold rounded-xl" style={{ background: 'linear-gradient(135deg, #D4A853, #E8B84B)' }}>
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
