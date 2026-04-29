import React from 'react';
import { Helmet } from 'react-helmet-async';
export default function AdminPropertyCreate() {
  return (
    <>
      <Helmet><title>Create Property — Admin</title></Helmet>
      <div>
        <h1 className="text-2xl font-display font-bold text-navy-900 mb-2">Create New Property</h1>
        <p className="text-slate-400">Full property creation form — implementation pending.</p>
      </div>
    </>
  );
}
