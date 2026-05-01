import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetPropertyBySlugQuery, useGetRelatedPropertiesQuery } from '@store/api/propertyApi';
import { useCreateEnquiryMutation } from '@store/api/leadApi';
import { selectCurrentUser } from '@store/slices/authSlice';
import { MapPinIcon, ArrowLeftIcon, PhoneIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, error } = useGetPropertyBySlugQuery(slug);
  const { data: relatedData } = useGetRelatedPropertiesQuery(slug);
  const [createEnquiry, { isLoading: isSubmitting }] = useCreateEnquiryMutation();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    message: '',
  });
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleEnquiry = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.phone) return setFormError('Name and Phone are required.');

    try {
      await createEnquiry({
        ...form,
        property: data?.data?._id,
        source: 'enquiry-form',
      }).unwrap();
      setSuccess(true);
      setForm({ ...form, message: '' });
    } catch (err) {
      setFormError(err?.data?.error?.message || 'Failed to send enquiry. Please try again.');
    }
  };

  if (isLoading) return <LoadingPage />;
  if (error) return (
    <div className="page-container py-20 text-center">
      <p className="text-slate-500 mb-4">Property not found or unavailable.</p>
      <Link to="/properties" className="bg-[#7C5CFF] text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all">Browse Properties</Link>
    </div>
  );

  const property = data?.data;
  const related = relatedData?.data || [];
  const images = property?.images || [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200' }];
  const primaryImage = images[currentImageIndex]?.url || images[0]?.url;

  return (
    <>
      <Helmet>
        <title>{property?.metaTitle || `${property?.title} — RealEstate`}</title>
        <meta name="description" content={property?.metaDescription || property?.description?.slice(0, 160)} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white">
        {/* Back */}
        <Link to="/properties" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] text-xs font-bold mb-8 group transition-colors">
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="rounded-[32px] overflow-hidden h-[400px] md:h-[500px] border border-[#EAE6DF] relative">
                <img src={primaryImage} alt={property?.title} className="w-full h-full object-cover animate-fade-in" />
                <div className="absolute top-4 left-4 bg-black/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-24 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${currentImageIndex === i ? 'border-[#7C5CFF] scale-[1.02]' : 'border-[#EAE6DF]'}`}
                    >
                      <img src={img.thumbnailUrl || img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Overview */}
            <div className="bg-[#FAF8F5]/30 border border-[#EAE6DF] rounded-[32px] p-6 md:p-10 text-[#1A1A1A]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#EAE6DF] pb-6 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-semibold tracking-tight">{property?.title}</h1>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-2 font-medium">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{property?.location?.locality}, {property?.location?.city}, {property?.location?.state}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-semibold text-[#7C5CFF]">{formatPrice(property?.price)}</span>
                  {property?.listingType === 'rent' && <span className="text-xs text-gray-400 font-semibold">/ month</span>}
                </div>
              </div>

              {/* Grid of specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 text-xs border-b border-[#EAE6DF]">
                {property?.bhkConfig && (
                  <div>
                    <span className="text-gray-400 font-medium block">Configuration</span>
                    <span className="text-sm font-bold block mt-1 uppercase text-[#1A1A1A]">{property.bhkConfig}</span>
                  </div>
                )}
                {property?.carpetArea && (
                  <div>
                    <span className="text-gray-400 font-medium block">Carpet Area</span>
                    <span className="text-sm font-bold block mt-1 text-[#1A1A1A]">{property.carpetArea} sqft</span>
                  </div>
                )}
                {property?.bathrooms && (
                  <div>
                    <span className="text-gray-400 font-medium block">Bathrooms</span>
                    <span className="text-sm font-bold block mt-1 text-[#1A1A1A]">{property.bathrooms}</span>
                  </div>
                )}
                {property?.possessionStatus && (
                  <div>
                    <span className="text-gray-400 font-medium block">Possession Status</span>
                    <span className="text-sm font-bold block mt-1 capitalize text-[#1A1A1A]">{property.possessionStatus?.replace('-', ' ')}</span>
                  </div>
                )}
              </div>

              {/* More details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 text-xs">
                {property?.propertyType && (
                  <div>
                    <span className="text-gray-400 font-medium block">Property Type</span>
                    <span className="text-sm font-bold block mt-1 capitalize text-[#1A1A1A]">{property.propertyType}</span>
                  </div>
                )}
                {property?.reraApproved !== undefined && (
                  <div>
                    <span className="text-gray-400 font-medium block">RERA Status</span>
                    <span className="text-sm font-bold block mt-1 text-[#1A1A1A]">{property.reraApproved ? 'Approved' : 'Pending'}</span>
                  </div>
                )}
                {property?.ageOfProperty && (
                  <div>
                    <span className="text-gray-400 font-medium block">Age of Property</span>
                    <span className="text-sm font-bold block mt-1 text-[#1A1A1A]">{property.ageOfProperty} Yrs</span>
                  </div>
                )}
                {property?.facing && (
                  <div>
                    <span className="text-gray-400 font-medium block">Facing Direction</span>
                    <span className="text-sm font-bold block mt-1 text-[#1A1A1A] uppercase">{property.facing}</span>
                  </div>
                )}
              </div>
            </div>

            {/* About / Description */}
            {property?.description && (
              <div className="space-y-4">
                <h2 className="text-xl font-display font-semibold text-[#1A1A1A] tracking-tight">About this Property</h2>
                <p className="text-[#666666] leading-relaxed text-sm font-medium">{property.description}</p>
              </div>
            )}

            {/* Amenities Section */}
            {property?.societyAmenities?.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-display font-semibold text-[#1A1A1A] tracking-tight">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.societyAmenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 border border-[#EAE6DF] rounded-2xl p-4 bg-white shadow-sm">
                      <span className="text-[#7C5CFF]">✦</span>
                      <span className="text-xs text-[#1A1A1A] font-bold capitalize">{a.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-display font-semibold text-[#1A1A1A] tracking-tight">Location & Landmarks</h2>
              <div className="rounded-[32px] overflow-hidden border border-[#EAE6DF] h-[350px] relative">
                <iframe 
                  title="Property Location View"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83611311093!2d77.06889754716766!3d28.527218141019057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1714418641951!5m2!1sen!2sin" 
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Enquiry Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-[#1A1A1A] text-white p-6 md:p-8 rounded-[32px] sticky top-24 shadow-xl">
              <h3 className="text-xl font-display font-semibold tracking-tight mb-6">Enquire Now</h3>
              
              {success ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center animate-fade-in">
                  <CheckCircleIcon className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-sm font-bold text-white">Enquiry Sent!</p>
                  <p className="text-[10px] text-gray-400 mt-1">Our expert will contact you within 24 hours.</p>
                  <button onClick={() => setSuccess(false)} className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#7C5CFF] hover:underline">Send another</button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleEnquiry}>
                  {formError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-[10px] font-bold">
                      <XMarkIcon className="w-4 h-4" /> {formError}
                    </div>
                  )}
                  <input 
                    required
                    className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#7C5CFF] font-medium" 
                    placeholder="Your Name" 
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input 
                    required
                    className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#7C5CFF] font-medium" 
                    placeholder="Phone Number" 
                    type="tel" 
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <input 
                    className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#7C5CFF] font-medium" 
                    placeholder="Email Address" 
                    type="email" 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <textarea 
                    className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#7C5CFF] font-medium resize-none h-24" 
                    placeholder="Your message..." 
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#7C5CFF] hover:bg-[#6D28D9] text-white text-xs font-bold py-3 rounded-full transition-all duration-300 shadow-md shadow-[#7C5CFF]/20 mt-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </form>
              )}

              {/* Chat & Call links */}
              <div className="flex gap-3 mt-6 border-t border-white/10 pt-6">
                <a 
                  href={`tel:+919999999999`}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full py-2.5 text-white font-bold text-xs transition-all"
                >
                  <PhoneIcon className="w-4 h-4 text-green-400" />
                  <span>Call Now</span>
                </a>
                <a 
                  href={`https://wa.me/919999999999?text=Interested in ${property?.title}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full py-2.5 text-white font-bold text-xs transition-all"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-green-400" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {property?.createdBy && (
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] flex items-center justify-center font-semibold text-sm text-white">
                    {property.createdBy.name?.[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{property.createdBy.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Property Expert</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-[#EAE6DF] pt-16">
            <h2 className="text-2xl font-display font-semibold text-[#1A1A1A] tracking-tight mb-8 uppercase">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {related.slice(0, 4).map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
