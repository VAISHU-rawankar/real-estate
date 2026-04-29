import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useGetPropertyBySlugQuery, useGetRelatedPropertiesQuery } from '@store/api/propertyApi';
import { MapPinIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import LoadingPage from '@components/common/LoadingPage';
import PropertyCard from '@components/property/PropertyCard';

function formatPrice(price) {
  if (!price) return 'Price on Request';
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`;
  if (price >= 100_000) return `₹${(price / 100_000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const { data, isLoading, error } = useGetPropertyBySlugQuery(slug);
  const { data: relatedData } = useGetRelatedPropertiesQuery(slug);

  if (isLoading) return <LoadingPage />;
  if (error) return (
    <div className="page-container py-20 text-center">
      <p className="text-slate-500 mb-4">Property not found or unavailable.</p>
      <Link to="/properties" className="btn-primary btn-md">Browse Properties</Link>
    </div>
  );

  const property = data?.data;
  const related = relatedData?.data || [];
  const primaryImage = property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200';

  return (
    <>
      <Helmet>
        <title>{property?.metaTitle || `${property?.title} — RealEstate`}</title>
        <meta name="description" content={property?.metaDescription || property?.description?.slice(0, 160)} />
      </Helmet>

      <div className="page-container py-8">
        {/* Back */}
        <Link to="/properties" className="flex items-center gap-2 text-slate-400 hover:text-navy-900 text-sm mb-6 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="rounded-3xl overflow-hidden h-80 sm:h-96">
              <img src={primaryImage} alt={property?.title} className="w-full h-full object-cover" />
            </div>

            {/* Gallery thumbnails */}
            {property?.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {property.images.slice(0, 6).map((img, i) => (
                  <img key={i} src={img.thumbnailUrl || img.url} alt="" className="w-24 h-20 object-cover rounded-xl flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" />
                ))}
              </div>
            )}

            {/* Details */}
            <div className="card p-6">
              <div className="flex flex-wrap items-start gap-4 justify-between mb-4">
                <h1 className="text-2xl font-display font-bold text-navy-900">{property?.title}</h1>
                <div className="text-3xl font-display font-bold text-gold-600">{formatPrice(property?.price)}</div>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-5">
                <MapPinIcon className="w-4 h-4" />
                <span>{property?.location?.locality}, {property?.location?.city}, {property?.location?.state}</span>
              </div>

              {/* Key specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-slate-100">
                {property?.bhkConfig && <div><p className="text-xs text-slate-400">Type</p><p className="font-semibold text-navy-900 uppercase">{property.bhkConfig}</p></div>}
                {property?.carpetArea && <div><p className="text-xs text-slate-400">Carpet Area</p><p className="font-semibold text-navy-900">{property.carpetArea} sqft</p></div>}
                {property?.bathrooms && <div><p className="text-xs text-slate-400">Bathrooms</p><p className="font-semibold text-navy-900">{property.bathrooms}</p></div>}
                {property?.possessionStatus && <div><p className="text-xs text-slate-400">Possession</p><p className="font-semibold text-navy-900 capitalize">{property.possessionStatus?.replace('-', ' ')}</p></div>}
              </div>

              {/* Description */}
              {property?.description && (
                <div className="mt-5">
                  <h2 className="font-display font-semibold text-navy-900 mb-3">About this Property</h2>
                  <p className="text-slate-500 leading-relaxed text-sm">{property.description}</p>
                </div>
              )}
            </div>

            {/* Amenities */}
            {property?.societyAmenities?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display font-semibold text-navy-900 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.societyAmenities.map((a) => (
                    <span key={a} className="badge badge-navy capitalize">{a.replace('-', ' ')}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enquiry Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-display font-bold text-navy-900 text-lg mb-5">Enquire Now</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input className="input-base" placeholder="Your Name" />
                <input className="input-base" placeholder="Phone Number" type="tel" />
                <input className="input-base" placeholder="Email (optional)" type="email" />
                <textarea className="input-base resize-none h-24" placeholder="Your message..." />
                <button type="submit" className="btn-primary btn-md w-full">Send Enquiry</button>
              </form>
              {property?.createdBy && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2">Listed by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{property.createdBy.name?.[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-900">{property.createdBy.name}</p>
                      <p className="text-xs text-slate-400">Property Expert</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.slice(0, 3).map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
