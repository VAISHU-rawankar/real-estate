import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import ToastContainer from '@components/common/ToastContainer';
import { selectToasts } from '@store/slices/uiSlice';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        {children || <Outlet />}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
