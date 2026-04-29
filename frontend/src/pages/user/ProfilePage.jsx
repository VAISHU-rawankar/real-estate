import React from 'react';
import { Helmet } from 'react-helmet-async';
export default function ProfilePage() {
  return (
    <>
      <Helmet><title>My Profile — RealEstate</title></Helmet>
      <div className="page-container py-10">
        <h1 className="section-title mb-8">My Profile</h1>
        <p className="text-slate-400">Profile settings form — implementation pending.</p>
      </div>
    </>
  );
}
