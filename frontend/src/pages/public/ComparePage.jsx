import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { useGetPropertiesQuery } from '@store/api/propertyApi';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids')?.split(',') || [];

  // Fetch properties (Ideally pass ids to query, or filter response)
  const { data, isLoading } = useGetPropertiesQuery();
  const allProperties = data?.data || [];
  const comparedProperties = allProperties.filter(p => ids.includes(p._id));

  return (
    <>
      <Helmet>
        <title>Compare Properties | RealEstate Platform</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white text-[#1A1A1A]">
        <Link to="/properties" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] text-xs font-bold mb-8 group transition-colors">
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Listings
        </Link>

        <h1 className="text-3xl font-display font-semibold tracking-tight mb-12">Compare Properties</h1>

        {isLoading ? (
          <p className="text-gray-400 text-sm font-semibold">Loading parameters...</p>
        ) : comparedProperties.length === 0 ? (
          <div className="text-center py-20 border border-[#EAE6DF] rounded-[32px] bg-[#FAF8F5]/30">
            <p className="text-gray-500 text-sm font-bold">No properties selected for comparison.</p>
            <Link to="/properties" className="inline-block mt-4 bg-[#7C5CFF] text-white text-xs font-bold px-6 py-2.5 rounded-full">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto pb-6">
            <table className="w-full text-left border-collapse border border-[#EAE6DF] rounded-[32px] overflow-hidden">
              <thead>
                <tr className="bg-[#FAF8F5]">
                  <th className="p-6 border border-[#EAE6DF] text-xs font-semibold text-[#1A1A1A]">Features</th>
                  {comparedProperties.map(p => (
                    <th key={p._id} className="p-6 border border-[#EAE6DF] text-center min-w-[220px]">
                      <div className="flex flex-col items-center">
                        <img 
                          src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'} 
                          alt="" 
                          className="w-32 h-24 object-cover rounded-xl border border-[#EAE6DF] mb-4 shadow-sm"
                        />
                        <span className="block text-sm font-semibold text-[#1A1A1A] max-w-[200px] truncate">{p.title}</span>
                        <span className="block text-xs font-bold text-[#7C5CFF] mt-1">₹{p.price?.toLocaleString('en-IN')}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs font-bold text-[#666666]">
                <tr>
                  <td className="p-6 border border-[#EAE6DF] bg-[#FAF8F5]/50">Locality</td>
                  {comparedProperties.map(p => (
                    <td key={p._id} className="p-6 border border-[#EAE6DF] text-center">{p.location?.locality || 'N/A'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 border border-[#EAE6DF] bg-[#FAF8F5]/50">Config</td>
                  {comparedProperties.map(p => (
                    <td key={p._id} className="p-6 border border-[#EAE6DF] text-center uppercase">{p.bhkConfig || 'N/A'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 border border-[#EAE6DF] bg-[#FAF8F5]/50">Carpet Area</td>
                  {comparedProperties.map(p => (
                    <td key={p._id} className="p-6 border border-[#EAE6DF] text-center">{p.carpetArea ? `${p.carpetArea} sqft` : 'N/A'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 border border-[#EAE6DF] bg-[#FAF8F5]/50">Possession</td>
                  {comparedProperties.map(p => (
                    <td key={p._id} className="p-6 border border-[#EAE6DF] text-center capitalize">{p.possessionStatus?.replace('-', ' ') || 'N/A'}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
