import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="text-9xl font-display font-bold text-navy-900/10 mb-4 leading-none">404</div>
        <h1 className="text-3xl font-display font-bold text-navy-900 mb-3">Page Not Found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary btn-md">
            <HomeIcon className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/properties" className="btn-outline btn-md">Browse Properties</Link>
        </div>
      </motion.div>
    </div>
  );
}
