import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-4 border-gold-200 border-t-gold-500 mb-4"
      />
      <p className="text-slate-400 text-sm font-medium">Loading...</p>
    </div>
  );
}
