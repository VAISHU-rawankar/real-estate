import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { selectToasts, dismissToast } from '@store/slices/uiSlice';

const ICONS = {
  success: { icon: CheckCircleIcon, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  error: { icon: XCircleIcon, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  warning: { icon: ExclamationCircleIcon, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  info: { icon: InformationCircleIcon, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
};

function Toast({ toast }) {
  const dispatch = useDispatch();
  const { icon: Icon, color, bg, border } = ICONS[toast.type] || ICONS.info;

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(toast.id)), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, dispatch]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`flex items-start gap-3 p-4 rounded-2xl border shadow-card-hover max-w-sm w-full ${bg} ${border}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${color}`} />
      <p className="flex-1 text-sm font-medium text-navy-900">{toast.message}</p>
      <button
        onClick={() => dispatch(dismissToast(toast.id))}
        className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector(selectToasts);
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
