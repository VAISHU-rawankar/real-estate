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
      <div className="flex items-center justify-center h-60">
        <p className="text-slate-400 animate-pulse text-sm">Loading property data...</p>
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
        <div className="hidden md:flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center gap-1 flex-1 relative last:after:hidden after:content-[''] after:h-[2px] after:bg-slate-100 after:w-full after:absolute after:top-5 after:left-1/2 after:-z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-gold-gradient text-white shadow-md' : isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                  {isCompleted ? <CheckIcon className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-navy-900 font-semibold' : 'text-slate-400'}`}>{step.name}</span>
              </div>
            );
          })}
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
              </AnimatePresence>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="btn-secondary btn-md flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Back
                </button>

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary btn-md flex items-center gap-2"
                  >
                    Next <ArrowRightIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn-primary btn-md"
                  >
                    {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                )}
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
    <div className="space-y-5">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 1: Basic Information</h3>
      <div>
        <label className="label">Property Title *</label>
        <input type="text" className="input" {...register('title', { required: 'Title is required' })} />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label">Type</label>
          <select className="input" {...register('propertyType')}><option value="residential">Residential</option><option value="commercial">Commercial</option></select>
        </div>
        <div>
          <label className="label">Sub Type</label>
          <select className="input" {...register('propertySubType')}><option value="apartment">Apartment</option><option value="villa">Villa</option></select>
        </div>
        <div>
          <label className="label">Listing Type</label>
          <select className="input" {...register('listingType')}><option value="sale">Sale</option><option value="rent">Rent</option></select>
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input h-32 resize-none" {...register('description')} />
      </div>
    </div>
  );
}

function Step2Location() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 2: Location Details</h3>
      <div>
        <label className="label">Full Address *</label>
        <input type="text" className="input" {...register('location.address', { required: 'Address is required' })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Locality</label><input type="text" className="input" {...register('location.locality')} /></div>
        <div><label className="label">City</label><input type="text" className="input" {...register('location.city')} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">State</label><input type="text" className="input" {...register('location.state')} /></div>
        <div><label className="label">Pincode</label><input type="text" className="input" {...register('location.pincode')} /></div>
      </div>
    </div>
  );
}

function Step3Details() {
  const { register } = useFormContext();
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 3: Property Details</h3>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="label">BHK</label><select className="input" {...register('bhkConfig')}><option value="1bhk">1 BHK</option><option value="2bhk">2 BHK</option><option value="3bhk">3 BHK</option></select></div>
        <div><label className="label">Bathrooms</label><input type="number" className="input" {...register('bathrooms')} /></div>
        <div><label className="label">Balconies</label><input type="number" className="input" {...register('balconies')} /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="label">Carpet Area</label><input type="number" className="input" {...register('carpetArea')} /></div>
        <div><label className="label">Built Area</label><input type="number" className="input" {...register('builtUpArea')} /></div>
        <div><label className="label">Super Area</label><input type="number" className="input" {...register('superBuiltUpArea')} /></div>
      </div>
    </div>
  );
}

function Step4Pricing() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 4: Pricing</h3>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Total Price (₹) *</label><input type="number" className="input" {...register('price', { required: 'Price is required' })} /></div>
        <div className="flex items-center mt-8">
          <input type="checkbox" id="editNegotiable" className="w-4 h-4 text-gold-500 rounded focus:ring-gold-500" {...register('priceNegotiable')} />
          <label htmlFor="editNegotiable" className="ml-2 text-sm text-slate-600">Negotiable</label>
        </div>
      </div>
    </div>
  );
}

const SOCIETY_AMENITIES = ['gym', 'swimming-pool', 'clubhouse', '24hr-security', 'power-backup', 'lift', 'cctv', 'garden', 'playground'];
function Step5Amenities() {
  const { register } = useFormContext();
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 5: Amenities</h3>
      <div>
        <h4 className="font-semibold text-sm text-navy-900 mb-3">Society Amenities</h4>
        <div className="grid grid-cols-3 gap-3">
          {SOCIETY_AMENITIES.map(amenity => (
            <label key={amenity} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-sm cursor-pointer capitalize">
              <input type="checkbox" value={amenity} className="rounded text-gold-500 focus:ring-gold-500" {...register('societyAmenities')} />
              {amenity.replace('-', ' ')}
            </label>
          ))}
        </div>
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
      dispatch(showToast({ type: 'success', message: 'Uploaded!' }));
    } catch (e) {
      dispatch(showToast({ type: 'error', message: 'Failed' }));
    }
  };

  const handleDelete = async (imgId) => {
    try {
      await deleteImage({ propertyId, imageId: imgId }).unwrap();
      setUploadedImages(uploadedImages.filter(img => img._id !== imgId));
      dispatch(showToast({ type: 'success', message: 'Image deleted' }));
    } catch (e) {
      dispatch(showToast({ type: 'error', message: 'Delete failed' }));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 6: Media Management</h3>
      <div {...getRootProps()} className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center cursor-pointer">
        <input {...getInputProps()} />
        <PhotoIcon className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-sm">Drag & drop files here, or click to browse</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {uploadedImages.map((img) => (
          <div key={img._id} className="relative aspect-square rounded-xl overflow-hidden group">
            <img src={img.thumbnailUrl || img.url} className="w-full h-full object-cover" />
            <button type="button" onClick={() => handleDelete(img._id)} className="absolute right-2 top-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step7Additional() {
  const { register } = useFormContext();
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 7: Additional Info</h3>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Project Name</label><input type="text" className="input" {...register('projectName')} /></div>
        <div><label className="label">RERA ID</label><input type="text" className="input" {...register('reraNumber')} /></div>
      </div>
    </div>
  );
}

function Step8Preview() {
  const { getValues } = useFormContext();
  const values = getValues();
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 8: Final Review</h3>
      <div className="bg-slate-50 p-6 rounded-2xl">
        <h4 className="text-lg font-bold">{values.title}</h4>
        <p className="text-sm text-slate-500 mt-1">{values.location?.address}</p>
        <p className="text-2xl font-bold text-navy-900 mt-4">₹ {values.price}</p>
      </div>
    </div>
  );
}
