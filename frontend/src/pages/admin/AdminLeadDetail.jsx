import React from 'react';
import { Helmet } from 'react-helmet-async';
export default function AdminLeadDetail() {
  return (
    <>
      <Helmet><title>Lead Detail — Admin</title></Helmet>
      <div>
        <h1 className="text-2xl font-display font-bold text-navy-900 mb-2">Lead Detail</h1>
        <p className="text-slate-400">Lead CRM detail view — implementation pending.</p>
      </div>
    </>
  );
}
