import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  BuildingOfficeIcon, MapPinIcon, DocumentTextIcon, BanknotesIcon, 
  SparklesIcon, PhotoIcon, PlusIcon, CheckIcon, ArrowLeftIcon, ArrowRightIcon,
  TrashIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  useGetAdminPropertyByIdQuery,
  useUpdatePropertyMutation, 
  useUploadPropertyImagesMutation,
  useDeletePropertyImageMutation
} from '@store/api/propertyApi';
import { useDispatch } from 'react-redux';
import { showToast } from '@store/slices/uiSlice';

const STEPS = [
  { id: 1, name: 'Basic Info', icon: BuildingOfficeIcon },
  { id: 2, name: 'Location', icon: MapPinIcon },
  { id: 3, name: 'Details', icon: DocumentTextIcon },
  { id: 4, name: 'Pricing', icon: BanknotesIcon },
  { id: 5, name: 'Amenities', icon: SparklesIcon },
  { id: 6, name: 'Media', icon: PhotoIcon },
  { id: 7, name: 'Additional', icon: PlusIcon },
  { id: 8, name: 'Preview', icon: CheckIcon },
];

export default function AdminPropertyEdit() {
  const { id: propertyId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: propertyData, isLoading: isLoadingProperty } = useGetAdminPropertyByIdQuery(propertyId);
  const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadPropertyImagesMutation();

  const methods = useForm();

  useEffect(() => {
    if (propertyData?.data) {
      const prop = propertyData.data;
      methods.reset({
        title: prop.title || '',
        propertyType: prop.propertyType || 'residential',
        propertySubType: prop.propertySubType || 'apartment',
        listingType: prop.listingType || 'sale',
        description: prop.description || '',
        location: {
          address: prop.location?.address || '',
          locality: prop.location?.locality || '',
          city: prop.location?.city || '',
          state: prop.location?.state || '',
          pincode: prop.location?.pincode || '',
          country: prop.location?.country || 'India'
        },
        bhkConfig: prop.bhkConfig || '2bhk',
        carpetArea: prop.carpetArea || '',
        builtUpArea: prop.builtUpArea || '',
        superBuiltUpArea: prop.superBuiltUpArea || '',
        areaUnit: prop.areaUnit || 'sqft',
        bathrooms: prop.bathrooms || 2,
        balconies: prop.balconies || 1,
        floorNumber: prop.floorNumber || '',
        totalFloors: prop.totalFloors || '',
        facing: prop.facing || 'east',
        ageOfProperty: prop.ageOfProperty || 'new',
        price: prop.price || '',
        priceNegotiable: prop.priceNegotiable || false,
        priceBreakup: {
          basePrice: prop.priceBreakup?.basePrice || '',
          stampDuty: prop.priceBreakup?.stampDuty || '',
          registrationCharges: prop.priceBreakup?.registrationCharges || '',
          maintenanceDeposit: prop.priceBreakup?.maintenanceDeposit || '',
          otherCharges: prop.priceBreakup?.otherCharges || ''
        },
        societyAmenities: prop.societyAmenities || [],
        unitAmenities: prop.unitAmenities || [],
        videoUrl: prop.videoUrl || '',
        virtualTourUrl: prop.virtualTourUrl || '',
        reraNumber: prop.reraNumber || '',
        reraApproved: prop.reraApproved || false,
        legalStatus: prop.legalStatus || '',
        projectName: prop.projectName || ''
      });
      if (prop.images) {
        setUploadedImages(prop.images);
      }
    }
  }, [propertyData, methods]);

  const { handleSubmit, trigger, getValues } = methods;

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) fieldsToValidate = ['title', 'propertyType', 'propertySubType', 'listingType'];
    if (currentStep === 2) fieldsToValidate = ['location.address', 'location.city', 'location.state', 'location.pincode', 'location.locality'];
    if (currentStep === 4) fieldsToValidate = ['price'];

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    try {
      // Auto-save changes to backend at each step
      const currentValues = getValues();
      await updateProperty({ id: propertyId, ...currentValues }).unwrap();
    } catch (err) {
      console.error('Auto-save failed:', err);
    }

    const next = currentStep + 1;
    setCurrentStep(next);
  };

  const prevStep = () => {
    const prev = Math.max(1, currentStep - 1);
    setCurrentStep(prev);
  };

  const onSubmit = async (data) => {
    try {
      await updateProperty({ id: propertyId, ...data }).unwrap();
      dispatch(showToast({ type: 'success', message: 'Property updated successfully!' }));
      navigate('/admin/properties');
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err?.data?.error?.message || 'Failed to update listing' }));
    }
  };

  if (isLoadingProperty) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading property details...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Edit Listing — Admin</title></Helmet>

      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900">Edit Listing</h1>
          <p className="text-slate-400 text-sm mt-1">Modify your existing property listing.</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100">
          <div className="flex justify-between items-center relative">
            {/* Connection Line */}
            <div className="absolute top-5 left-[5%] right-[5%] h-[2px] bg-slate-100 -z-0">
              <motion.div 
                className="h-full bg-gold-gradient"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative group ${
                      isActive 
                        ? 'bg-gold-gradient text-white shadow-gold scale-110 z-20' 
                        : isCompleted 
                          ? 'bg-emerald-500 text-white shadow-sm z-10' 
                          : 'bg-white text-slate-400 border border-slate-200 hover:border-gold-300 hover:text-gold-500 z-10'
                    }`}
                  >
                    {isCompleted ? <CheckIcon className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </button>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-navy-900' : 'text-slate-400'}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="card p-6 md:p-8">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 1 && <Step1BasicInfo />}
                  {currentStep === 2 && <Step2Location />}
                  {currentStep === 3 && <Step3Details />}
                  {currentStep === 4 && <Step4Pricing />}
                  {currentStep === 5 && <Step5Amenities />}
                  {currentStep === 6 && <Step6Media propertyId={propertyId} setUploadedImages={setUploadedImages} uploadedImages={uploadedImages} uploadImagesMutation={uploadImages} isUploading={isUploading} />}
                  {currentStep === 7 && <Step7Additional />}
                  {currentStep === 8 && <Step8Preview propertyId={propertyId} />}
                </motion.div>
              </AnimatePresence>              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-8 border-t border-slate-100 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="btn-ghost flex items-center gap-2 disabled:opacity-30 px-6 py-3"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Previous Step
                </button>

                <div className="flex items-center gap-4">
                  {currentStep < STEPS.length ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary px-8 py-3 flex items-center gap-2 group"
                    >
                      Continue 
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="btn-primary px-10 py-3 shadow-gold-lg"
                    >
                      {isUpdating ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Publishing...
                        </span>
                      ) : 'Finish & Update Listing'}
                    </button>
                  )}
                </div>
              </div>

            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}

/* ─── SHARED STEP COMPONENTS ─────────────────────────────────────────────────── */
function Step1BasicInfo() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
          <BuildingOfficeIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-navy-900">Basic Information</h3>
          <p className="text-slate-400 text-xs">Define the core identity of your property listing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="label flex items-center gap-2">
            Property Title <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <input 
              type="text" 
              className={`input group-hover:border-gold-300 ${errors.title ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              placeholder="e.g. Luxurious 4BHK Villa with Private Pool"
              {...register('title', { required: 'Property title is required' })} 
            />
          </div>
          {errors.title && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
            <InformationCircleIcon className="w-3.5 h-3.5" /> {errors.title.message}
          </p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">Property Type</label>
            <select className="input" {...register('propertyType')}>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="land">Land / Plot</option>
            </select>
          </div>
          <div>
            <label className="label">Property Sub-type</label>
            <select className="input" {...register('propertySubType')}>
              <optgroup label="Residential">
                <option value="apartment">Apartment / Flat</option>
                <option value="villa">Independent House / Villa</option>
                <option value="builder-floor">Builder Floor</option>
                <option value="penthouse">Penthouse</option>
              </optgroup>
              <optgroup label="Commercial">
                <option value="office">Office Space</option>
                <option value="shop">Shop / Showroom</option>
                <option value="warehouse">Warehouse / Godown</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className="label">Listing Type</label>
            <select className="input" {...register('listingType')}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="lease">Lease</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Detailed Description</label>
          <textarea 
            className="input min-h-[160px] py-4 leading-relaxed resize-none" 
            placeholder="Tell potential buyers about the unique features, surroundings, and benefits of this property..."
            {...register('description')} 
          />
          <p className="text-slate-400 text-[10px] mt-2 italic">A detailed description helps in better search rankings and visibility.</p>
        </div>
      </div>
    </div>
  );
}

function Step2Location() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
          <MapPinIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-navy-900">Location Details</h3>
          <p className="text-slate-400 text-xs">Precisely locate your property for potential buyers.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="label">Full Street Address *</label>
          <input 
            type="text" 
            className={`input ${errors.location?.address ? 'border-red-500' : ''}`}
            placeholder="House No, Building Name, Street Name..."
            {...register('location.address', { required: 'Address is required' })} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Locality / Landmark</label>
            <input type="text" className="input" placeholder="e.g. Near Central Park" {...register('location.locality')} />
          </div>
          <div>
            <label className="label">City *</label>
            <input 
              type="text" 
              className={`input ${errors.location?.city ? 'border-red-500' : ''}`}
              placeholder="e.g. Hyderabad" 
              {...register('location.city', { required: 'City is required' })} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">State *</label>
            <input 
              type="text" 
              className={`input ${errors.location?.state ? 'border-red-500' : ''}`}
              placeholder="e.g. Telangana" 
              {...register('location.state', { required: 'State is required' })} 
            />
          </div>
          <div>
            <label className="label">Pincode *</label>
            <input 
              type="text" 
              className={`input ${errors.location?.pincode ? 'border-red-500' : ''}`}
              placeholder="6-digit PIN" 
              {...register('location.pincode', { required: 'Pincode is required' })} 
            />
          </div>
          <div>
            <label className="label">Country</label>
            <input type="text" className="input" defaultValue="India" {...register('location.country')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3Details() {
  const { register } = useFormContext();
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
          <DocumentTextIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-navy-900">Property Details</h3>
          <p className="text-slate-400 text-xs">Specify the configuration and area of your property.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="label">Configuration (BHK)</label>
          <select className="input" {...register('bhkConfig')}>
            <option value="1bhk">1 BHK</option>
            <option value="2bhk">2 BHK</option>
            <option value="3bhk">3 BHK</option>
            <option value="4bhk">4 BHK</option>
            <option value="4+bhk">4+ BHK</option>
          </select>
        </div>
        <div><label className="label">Bathrooms</label><input type="number" className="input" {...register('bathrooms')} /></div>
        <div><label className="label">Balconies</label><input type="number" className="input" {...register('balconies')} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
        <div>
          <label className="label">Carpet Area (sqft)</label>
          <input type="number" className="input bg-white" placeholder="sqft" {...register('carpetArea')} />
        </div>
        <div>
          <label className="label">Built-up Area (sqft)</label>
          <input type="number" className="input bg-white" placeholder="sqft" {...register('builtUpArea')} />
        </div>
        <div>
          <label className="label">Super Built-up Area</label>
          <input type="number" className="input bg-white" placeholder="sqft" {...register('superBuiltUpArea')} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><label className="label">Floor Number</label><input type="text" className="input" {...register('floorNumber')} /></div>
        <div><label className="label">Total Floors</label><input type="text" className="input" {...register('totalFloors')} /></div>
        <div>
          <label className="label">Facing</label>
          <select className="input" {...register('facing')}>
            <option value="east">East</option>
            <option value="west">West</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="north-east">North-East</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Step4Pricing() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
          <BanknotesIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-navy-900">Pricing & Payment</h3>
          <p className="text-slate-400 text-xs">Set the financial terms for this listing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <label className="label">Total Asking Price (₹) *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
            <input 
              type="number" 
              className={`input pl-8 text-lg font-bold ${errors.price ? 'border-red-500' : ''}`}
              placeholder="Enter amount"
              {...register('price', { required: 'Asking price is required' })} 
            />
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1.5">{errors.price.message}</p>}
        </div>

        <div className="p-6 bg-gold-50/50 rounded-2xl border border-gold-100">
          <div className="flex items-center gap-3">
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="editNegotiable" className="sr-only peer" {...register('priceNegotiable')} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
              <label htmlFor="editNegotiable" className="ml-3 text-sm font-semibold text-navy-900">Price is Negotiable</label>
            </div>
          </div>
          <p className="text-slate-500 text-[11px] mt-2">Checking this informs buyers that you are open to offers.</p>
        </div>
      </div>
    </div>
  );
}

const SOCIETY_AMENITIES = ['gym', 'swimming-pool', 'clubhouse', '24hr-security', 'power-backup', 'lift', 'cctv', 'garden', 'playground'];
function Step5Amenities() {
  const { register } = useFormContext();
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
          <SparklesIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-navy-900">Amenities & Features</h3>
          <p className="text-slate-400 text-xs">Select all amenities available at this property.</p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            Society Amenities
            <span className="h-px flex-1 bg-slate-100"></span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SOCIETY_AMENITIES.map(amenity => (
              <label key={amenity} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:border-gold-300 hover:shadow-sm cursor-pointer transition-all group">
                <input type="checkbox" value={amenity} className="w-5 h-5 rounded text-gold-500 focus:ring-gold-500 border-slate-300" {...register('societyAmenities')} />
                <span className="text-sm font-medium text-slate-600 group-hover:text-navy-900 capitalize">{amenity.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Step6Media({ propertyId, uploadedImages, setUploadedImages, uploadImagesMutation, isUploading }) {
  const { register } = useFormContext();
  const dispatch = useDispatch();
  const [deleteImage] = useDeletePropertyImageMutation();

  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach(file => formData.append('images', file));
    try {
      const response = await uploadImagesMutation({ id: propertyId, formData }).unwrap();
      setUploadedImages([...uploadedImages, ...response.data]);
      dispatch(showToast({ type: 'success', message: 'Images uploaded successfully!' }));
    } catch (e) {
      dispatch(showToast({ type: 'error', message: 'Upload failed. Please try again.' }));
    }
  };

  const handleDelete = async (imgId) => {
    try {
      await deleteImage({ propertyId, imageId: imgId }).unwrap();
      setUploadedImages(uploadedImages.filter(img => img._id !== imgId));
      dispatch(showToast({ type: 'success', message: 'Image deleted' }));
    } catch (e) {
      dispatch(showToast({ type: 'error', message: 'Failed to delete image' }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
          <PhotoIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-navy-900">Media Management</h3>
          <p className="text-slate-400 text-xs">High-quality photos significantly increase interest.</p>
        </div>
      </div>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${
          isDragActive ? 'border-gold-500 bg-gold-50' : 'border-slate-200 hover:border-gold-300 bg-slate-50/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 text-slate-400">
          <PhotoIcon className="w-8 h-8" />
        </div>
        <p className="text-navy-900 font-semibold text-sm">Drag & drop files here, or click to browse</p>
        <p className="text-slate-400 text-xs mt-1">Supports JPG, PNG, WEBP (Max 5MB each)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {uploadedImages.map((img) => (
          <div key={img._id} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-slate-100 bg-slate-50">
            <img src={img.thumbnailUrl || img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Property" />
            <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button" 
                onClick={() => handleDelete(img._id)} 
                className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-red-500 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {isUploading && (
           <div className="aspect-square rounded-2xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center animate-pulse">
             <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mb-2"></div>
             <span className="text-[10px] font-bold text-slate-400 uppercase">Uploading...</span>
           </div>
        )}
      </div>
    </div>
  );
}

function Step7Additional() {
  const { register } = useFormContext();
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
          <PlusIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-navy-900">Additional Information</h3>
          <p className="text-slate-400 text-xs">Project details and RERA certification.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Project / Society Name</label>
          <input type="text" className="input" placeholder="e.g. Prestige Heights" {...register('projectName')} />
        </div>
        <div>
          <label className="label">RERA ID</label>
          <input type="text" className="input" placeholder="RERA registration number" {...register('reraNumber')} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Video URL (YouTube/Vimeo)</label>
          <input type="url" className="input" placeholder="https://..." {...register('videoUrl')} />
        </div>
        <div>
          <label className="label">Virtual Tour URL</label>
          <input type="url" className="input" placeholder="https://..." {...register('virtualTourUrl')} />
        </div>
      </div>
    </div>
  );
}

function Step8Preview() {
  const { getValues } = useFormContext();
  const values = getValues();
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
          <CheckIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-navy-900">Final Review</h3>
          <p className="text-slate-400 text-xs">Double check everything before publishing your updates.</p>
        </div>
      </div>

      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <span className="badge-gold">Preview Mode</span>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-2xl font-bold text-navy-900">{values.title || 'No Title Provided'}</h4>
            <div className="flex items-center gap-2 text-slate-500 mt-2">
              <MapPinIcon className="w-4 h-4" />
              <span className="text-sm">{values.location?.address}, {values.location?.city}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Price</p>
              <p className="text-lg font-bold text-navy-900">₹ {values.price?.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Area</p>
              <p className="text-lg font-bold text-navy-900">{values.builtUpArea} {values.areaUnit}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Type</p>
              <p className="text-lg font-bold text-navy-900 capitalize">{values.propertySubType}</p>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-3">
              "{values.description}"
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
        <InformationCircleIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          Updating this property will immediately reflect changes on the public listing page. Make sure all legal information and pricing is accurate.
        </p>
      </div>
    </div>
  );
}
