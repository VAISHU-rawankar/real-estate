import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  BuildingOfficeIcon, MapPinIcon, DocumentTextIcon, BanknotesIcon, 
  SparklesIcon, PhotoIcon, PlusIcon, CheckIcon, ArrowLeftIcon, ArrowRightIcon,
  TrashIcon, InformationCircleIcon, VideoCameraIcon
} from '@heroicons/react/24/outline';
import { 
  useCreatePropertyMutation, 
  useUpdatePropertyMutation, 
  useUploadPropertyImagesMutation,
  useUploadPropertyVideoMutation 
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

export default function AdminPropertyCreate() {
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyId, setPropertyId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadPropertyImagesMutation();
  const [uploadVideo, { isLoading: isUploadingVideo }] = useUploadPropertyVideoMutation();

  const methods = useForm({
    defaultValues: {
      title: '',
      propertyType: 'residential',
      propertySubType: 'apartment',
      listingType: 'sale',
      description: '',
      location: { address: '', locality: '', city: '', state: '', pincode: '', country: 'India' },
      bhkConfig: '2bhk',
      carpetArea: '', builtUpArea: '', superBuiltUpArea: '', areaUnit: 'sqft',
      bathrooms: 2, balconies: 1, floorNumber: '', totalFloors: '',
      facing: 'east', ageOfProperty: 'new',
      price: '', priceNegotiable: false,
      priceBreakup: { basePrice: '', stampDuty: '', registrationCharges: '', maintenanceDeposit: '', otherCharges: '' },
      societyAmenities: [], unitAmenities: [],
      videoUrl: '', virtualTourUrl: '',
      reraNumber: '', reraApproved: false, legalStatus: '', projectName: ''
    }
  });

  const { handleSubmit, trigger, getValues, watch } = methods;

  // Auto-save progress to local storage
  useEffect(() => {
    const saved = localStorage.getItem('property_wizard_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        methods.reset(parsed.values);
        setCurrentStep(parsed.step || 1);
        if (parsed.propertyId) setPropertyId(parsed.propertyId);
      } catch (e) {
        console.error(e);
      }
    }
  }, [methods]);

  const saveDraftLocally = (stepOverride = currentStep) => {
    localStorage.setItem('property_wizard_draft', JSON.stringify({
      values: getValues(),
      step: stepOverride,
      propertyId
    }));
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) fieldsToValidate = ['title', 'propertyType', 'propertySubType', 'listingType'];
    if (currentStep === 2) fieldsToValidate = ['location.address', 'location.city', 'location.state', 'location.pincode', 'location.locality'];
    if (currentStep === 4) fieldsToValidate = ['price'];

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    if (currentStep === 5 && !propertyId) {
      // Create listing in backend right before Media upload
      try {
        const payload = getValues();
        const response = await createProperty(payload).unwrap();
        setPropertyId(response.data._id);
        dispatch(showToast({ type: 'success', message: 'Listing draft initialized successfully!' }));
      } catch (err) {
        dispatch(showToast({ type: 'error', message: err?.data?.error?.message || 'Failed to save draft' }));
        return;
      }
    }

    const next = currentStep + 1;
    setCurrentStep(next);
    saveDraftLocally(next);
  };

  const prevStep = () => {
    const prev = Math.max(1, currentStep - 1);
    setCurrentStep(prev);
    saveDraftLocally(prev);
  };

  const onSubmit = async (data) => {
    try {
      if (propertyId) {
        await updateProperty({ id: propertyId, ...data, status: 'active' }).unwrap();
      } else {
        await createProperty({ ...data, status: 'active' }).unwrap();
      }
      localStorage.removeItem('property_wizard_draft');
      dispatch(showToast({ type: 'success', message: 'Property published successfully!' }));
      navigate('/admin/properties');
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err?.data?.error?.message || 'Failed to publish listing' }));
    }
  };

  return (
    <>
      <Helmet><title>Create New Listing — Admin</title></Helmet>

      <div className="max-w-6xl space-y-8 pb-16">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900">Create New Listing</h1>
          <p className="text-slate-400 text-sm mt-1">Fill out the information below to add a property.</p>
        </div>

        {/* Progress Bar */}
        <div className="hidden md:flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <button
                key={step.id}
                type="button"
                onClick={async () => {
                  if (step.id < currentStep) {
                    setCurrentStep(step.id);
                    saveDraftLocally(step.id);
                  } else if (step.id > currentStep) {
                    // Try to go forward only if current step is valid
                    let fieldsToValidate = [];
                    if (currentStep === 1) fieldsToValidate = ['title', 'propertyType', 'propertySubType', 'listingType'];
                    if (currentStep === 2) fieldsToValidate = ['location.address', 'location.city', 'location.state', 'location.pincode', 'location.locality'];
                    if (currentStep === 4) fieldsToValidate = ['price'];
                    
                    const isValid = await trigger(fieldsToValidate);
                    if (isValid) {
                      setCurrentStep(step.id);
                      saveDraftLocally(step.id);
                    }
                  }
                }}
                className="flex flex-col items-center gap-1 flex-1 relative last:after:hidden after:content-[''] after:h-[2px] after:bg-slate-100 after:w-full after:absolute after:top-5 after:left-1/2 after:-z-10 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-gold-gradient text-white shadow-md' : isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-navy-900'}`}>
                  {isCompleted ? <CheckIcon className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${isActive ? 'text-navy-900 font-bold' : 'text-slate-400 group-hover:text-navy-700 transition-colors'}`}>{step.name}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Progress */}
        <div className="md:hidden bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-slate-100">
          <span className="text-sm font-semibold text-navy-900">Step {currentStep} of {STEPS.length}</span>
          <span className="text-sm text-slate-500">{STEPS[currentStep - 1].name}</span>
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
                  {currentStep === 6 && <Step6Media propertyId={propertyId} setUploadedImages={setUploadedImages} uploadedImages={uploadedImages} uploadImagesMutation={uploadImages} isUploading={isUploading} uploadVideoMutation={uploadVideo} isUploadingVideo={isUploadingVideo} />}
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
                    disabled={isCreating}
                    className="btn-primary btn-md flex items-center gap-2"
                  >
                    {isCreating ? 'Saving...' : 'Next'} <ArrowRightIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn-primary btn-md"
                  >
                    {isUpdating ? 'Publishing...' : 'Publish Listing'}
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

/* ─── STEP COMPONENTS ────────────────────────────────────────────────────────── */

function Step1BasicInfo() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 1: Basic Information</h3>
      
      <div>
        <label className="label">Property Title *</label>
        <input 
          type="text" 
          className={`input ${errors.title ? 'border-red-500' : ''}`} 
          placeholder="e.g. Luxurious 3 BHK Apartment in Bandra"
          {...register('title', { required: 'Title is required', maxLength: 200 })}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Property Type *</label>
          <select className="input" {...register('propertyType', { required: true })}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="agricultural">Agricultural</option>
            <option value="plot">Plot / Land</option>
          </select>
        </div>

        <div>
          <label className="label">Sub Type *</label>
          <select className="input" {...register('propertySubType', { required: true })}>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="independent-house">Independent House</option>
            <option value="studio">Studio</option>
            <option value="penthouse">Penthouse</option>
            <option value="retail-shop">Retail Shop</option>
            <option value="office-space">Office Space</option>
          </select>
        </div>

        <div>
          <label className="label">Listing Type *</label>
          <select className="input" {...register('listingType', { required: true })}>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="lease">Lease</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea 
          className="input h-32 py-2 resize-none" 
          placeholder="Provide a detailed description of the property..."
          {...register('description')}
        />
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
        <input 
          type="text" 
          className={`input ${errors.location?.address ? 'border-red-500' : ''}`}
          placeholder="Flat/House No, Building, Street Name"
          {...register('location.address', { required: 'Address is required' })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Locality *</label>
          <input type="text" className="input" placeholder="e.g. Bandra West" {...register('location.locality', { required: 'Locality is required' })} />
        </div>
        <div>
          <label className="label">City *</label>
          <input type="text" className="input" placeholder="e.g. Mumbai" {...register('location.city', { required: 'City is required' })} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">State *</label>
          <input type="text" className="input" placeholder="e.g. Maharashtra" {...register('location.state', { required: 'State is required' })} />
        </div>
        <div>
          <label className="label">Pincode *</label>
          <input type="text" className="input" placeholder="6 digits" maxLength={6} {...register('location.pincode', { required: 'Pincode is required' })} />
        </div>
      </div>
    </div>
  );
}

function Step3Details() {
  const { register } = useFormContext();
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 3: Property Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">BHK Configuration</label>
          <select className="input" {...register('bhkConfig')}>
            <option value="studio">Studio</option>
            <option value="1bhk">1 BHK</option>
            <option value="2bhk">2 BHK</option>
            <option value="3bhk">3 BHK</option>
            <option value="4bhk">4 BHK</option>
            <option value="4+bhk">4+ BHK</option>
          </select>
        </div>
        <div>
          <label className="label">Bathrooms</label>
          <input type="number" className="input" min={0} {...register('bathrooms')} />
        </div>
        <div>
          <label className="label">Balconies</label>
          <input type="number" className="input" min={0} {...register('balconies')} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Carpet Area (sqft)</label>
          <input type="number" className="input" {...register('carpetArea')} />
        </div>
        <div>
          <label className="label">Built-up Area (sqft)</label>
          <input type="number" className="input" {...register('builtUpArea')} />
        </div>
        <div>
          <label className="label">Super Built-up Area</label>
          <input type="number" className="input" {...register('superBuiltUpArea')} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="label">Floor No.</label>
          <input type="number" className="input" {...register('floorNumber')} />
        </div>
        <div>
          <label className="label">Total Floors</label>
          <input type="number" className="input" {...register('totalFloors')} />
        </div>
        <div>
          <label className="label">Facing</label>
          <select className="input" {...register('facing')}>
            <option value="east">East</option>
            <option value="west">West</option>
            <option value="north">North</option>
            <option value="south">South</option>
          </select>
        </div>
        <div>
          <label className="label">Age of Property</label>
          <select className="input" {...register('ageOfProperty')}>
            <option value="new">Brand New</option>
            <option value="less-than-5">0-5 Years</option>
            <option value="5-10">5-10 Years</option>
            <option value="10+">10+ Years</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Step4Pricing() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 4: Pricing</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Total Price (₹) *</label>
          <input 
            type="number" 
            className={`input ${errors.price ? 'border-red-500' : ''}`} 
            placeholder="Total asking price"
            {...register('price', { required: 'Price is required' })}
          />
        </div>
        <div className="flex items-center mt-8">
          <input type="checkbox" id="priceNegotiable" className="w-4 h-4 text-gold-500 rounded border-slate-300 focus:ring-gold-500" {...register('priceNegotiable')} />
          <label htmlFor="priceNegotiable" className="ml-2 text-sm text-slate-600 select-none">Price is Negotiable</label>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl space-y-4">
        <h4 className="text-sm font-semibold text-navy-900 flex items-center gap-1">
          <InformationCircleIcon className="w-4 h-4 text-slate-400" /> Optional Price Breakup
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label text-xs">Base Price (₹)</label>
            <input type="number" className="input bg-white" {...register('priceBreakup.basePrice')} />
          </div>
          <div>
            <label className="label text-xs">Stamp Duty (₹)</label>
            <input type="number" className="input bg-white" {...register('priceBreakup.stampDuty')} />
          </div>
          <div>
            <label className="label text-xs">Registration Charges (₹)</label>
            <input type="number" className="input bg-white" {...register('priceBreakup.registrationCharges')} />
          </div>
        </div>
      </div>
    </div>
  );
}

const SOCIETY_AMENITIES = ['gym', 'swimming-pool', 'clubhouse', '24hr-security', 'power-backup', 'lift', 'cctv', 'garden', 'playground'];
const UNIT_AMENITIES = ['air-conditioning', 'modular-kitchen', 'wardrobe', 'geyser', 'water-purifier', 'wood-flooring'];

function Step5Amenities() {
  const { register } = useFormContext();
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 5: Amenities</h3>

      <div>
        <h4 className="font-semibold text-sm text-navy-900 mb-3">Society Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SOCIETY_AMENITIES.map(amenity => (
            <label key={amenity} className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl cursor-pointer text-sm capitalize text-slate-700">
              <input type="checkbox" value={amenity} className="text-gold-500 rounded focus:ring-gold-500" {...register('societyAmenities')} />
              {amenity.replace('-', ' ')}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-navy-900 mb-3">Unit Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {UNIT_AMENITIES.map(amenity => (
            <label key={amenity} className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl cursor-pointer text-sm capitalize text-slate-700">
              <input type="checkbox" value={amenity} className="text-gold-500 rounded focus:ring-gold-500" {...register('unitAmenities')} />
              {amenity.replace('-', ' ')}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step6Media({ propertyId, uploadedImages, setUploadedImages, uploadImagesMutation, isUploading, uploadVideoMutation, isUploadingVideo }) {
  const { register, setValue, watch } = useFormContext();
  const dispatch = useDispatch();
  const videoUrl = watch('videoUrl');

  const onDropImages = async (acceptedFiles) => {
    if (!propertyId) {
      dispatch(showToast({ type: 'warning', message: 'Initialize draft first before media upload' }));
      return;
    }
    
    const formData = new FormData();
    acceptedFiles.forEach(file => formData.append('images', file));

    try {
      const response = await uploadImagesMutation({ id: propertyId, formData }).unwrap();
      setUploadedImages([...uploadedImages, ...response.data]);
      dispatch(showToast({ type: 'success', message: 'Images uploaded successfully!' }));
    } catch (e) {
      dispatch(showToast({ type: 'error', message: 'Upload failed.' }));
    }
  };

  const onVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!propertyId) {
      dispatch(showToast({ type: 'warning', message: 'Initialize draft first before video upload' }));
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await uploadVideoMutation({ id: propertyId, formData }).unwrap();
      setValue('videoUrl', response.data.url, { shouldDirty: true });
      dispatch(showToast({ type: 'success', message: 'Video uploaded successfully!' }));
    } catch (e) {
      dispatch(showToast({ type: 'error', message: 'Video upload failed.' }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropImages, accept: { 'image/*': [] }, maxFiles: 30
  });

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 6: Media Upload</h3>

      {/* Image Upload Area */}
      <div className="space-y-4">
        <label className="label">Property Photos</label>
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive ? 'border-gold-500 bg-gold-50/20' : 'border-slate-200 hover:border-slate-300'}`}>
          <input {...getInputProps()} />
          <PhotoIcon className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-700">Drag & drop images here, or click to browse</p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPEG, WebP up to 10MB each (Max 30 images)</p>
          {isUploading && <p className="text-gold-600 font-semibold text-sm mt-4 animate-pulse">Uploading images...</p>}
        </div>

        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {uploadedImages.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100">
                <img src={img.thumbnailUrl || img.url} alt="Uploaded" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
        <div className="space-y-4">
          <label className="label">Option 1: YouTube / Vimeo Link</label>
          <div className="relative">
            <input 
              type="text" 
              className="input pr-10" 
              placeholder="e.g. https://youtube.com/watch?v=..." 
              {...register('videoUrl')} 
            />
            <VideoCameraIcon className="w-5 h-5 text-slate-300 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <p className="text-[10px] text-slate-400">Provide a link to a hosted video. This will be prioritized.</p>
        </div>

        <div className="space-y-4">
          <label className="label">Option 2: Direct Video Upload</label>
          <div className="relative group">
            <input 
              type="file" 
              accept="video/*" 
              onChange={onVideoUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              disabled={isUploadingVideo}
            />
            <div className={`p-4 rounded-xl border-2 border-dashed transition-all flex items-center gap-3 ${isUploadingVideo ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 group-hover:border-[#7C5CFF] group-hover:bg-[#7C5CFF]/5'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isUploadingVideo ? 'bg-slate-100 text-slate-400' : 'bg-[#7C5CFF]/10 text-[#7C5CFF]'}`}>
                {isUploadingVideo ? <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" /> : <VideoCameraIcon className="w-6 h-6" />}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-navy-900 truncate">
                  {isUploadingVideo ? 'Uploading...' : 'Choose video file'}
                </p>
                <p className="text-[10px] text-slate-400">MP4, WebM up to 50MB</p>
              </div>
            </div>
          </div>
          {videoUrl && videoUrl.startsWith('http') && !videoUrl.includes('youtube') && !videoUrl.includes('vimeo') && (
             <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg text-xs font-semibold">
                <CheckIcon className="w-4 h-4" /> Video uploaded successfully
             </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-50">
        <label className="label">Virtual Tour URL (3D Walkthrough)</label>
        <input type="text" className="input" placeholder="e.g. Matterport or 360 viewer link" {...register('virtualTourUrl')} />
      </div>
    </div>
  );
}

function Step7Additional() {
  const { register } = useFormContext();
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 7: Additional Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Project Name</label>
          <input type="text" className="input" placeholder="e.g. Lodha Belmondo" {...register('projectName')} />
        </div>
        <div>
          <label className="label">RERA Number</label>
          <input type="text" className="input" placeholder="RERA ID" {...register('reraNumber')} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Legal Status</label>
          <input type="text" className="input" placeholder="e.g. OC Received, Freehold" {...register('legalStatus')} />
        </div>
        <div className="flex items-center mt-8">
          <input type="checkbox" id="reraApproved" className="w-4 h-4 text-gold-500 rounded border-slate-300 focus:ring-gold-500" {...register('reraApproved')} />
          <label htmlFor="reraApproved" className="ml-2 text-sm text-slate-600 select-none">RERA Approved</label>
        </div>
      </div>
    </div>
  );
}

function Step8Preview({ propertyId }) {
  const { getValues } = useFormContext();
  const values = getValues();
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-display font-bold text-navy-900 border-b pb-2">Step 8: Final Review</h3>
      
      <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
        <h4 className="text-xl font-display font-bold text-navy-900">{values.title}</h4>
        <p className="text-sm text-slate-500">{values.location?.address}, {values.location?.locality}, {values.location?.city}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block">Asking Price</span>
            <span className="text-lg font-bold text-navy-900">₹ {values.price}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block">Configuration</span>
            <span className="text-lg font-bold text-navy-900 capitalize">{values.bhkConfig}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block">Carpet Area</span>
            <span className="text-lg font-bold text-navy-900">{values.carpetArea} {values.areaUnit}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block">Property Status</span>
            <span className="text-lg font-bold text-emerald-600">Draft</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100">
        <InformationCircleIcon className="w-5 h-5 flex-shrink-0" />
        <p>Review all information before publishing. This listing will go live to the public upon clicking "Publish".</p>
      </div>
    </div>
  );
}
