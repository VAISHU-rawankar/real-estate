import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useGetPropertiesQuery } from '@store/api/propertyApi';

export default function BlogPage() {
  return (
    <>
      <Helmet><title>Blog — RealEstate Insights</title></Helmet>
      <div className="page-container py-20">
        <h1 className="section-title text-center mb-4">Real Estate Insights</h1>
        <p className="section-subtitle mx-auto text-center mb-12">Expert advice, market trends, and property investment tips.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Top 10 Real Estate Investment Tips for 2025', date: 'Jan 15, 2025', tag: 'Investment' },
            { title: 'RERA: Everything You Need to Know', date: 'Jan 10, 2025', tag: 'Legal' },
            { title: 'Home Loan Guide: Getting the Best Rate', date: 'Jan 5, 2025', tag: 'Finance' },
          ].map((post) => (
            <div key={post.title} className="card overflow-hidden hover-lift cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
                <span className="text-white/20 text-6xl font-display font-bold">{post.tag[0]}</span>
              </div>
              <div className="p-5">
                <span className="badge badge-gold mb-3">{post.tag}</span>
                <h3 className="font-display font-semibold text-navy-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-slate-400 text-sm">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
