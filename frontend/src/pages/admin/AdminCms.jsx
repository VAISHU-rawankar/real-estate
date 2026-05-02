import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  DocumentTextIcon, PlusIcon, TrashIcon,
  CheckCircleIcon, XMarkIcon, PhotoIcon
} from '@heroicons/react/24/outline';
import { useGetSectionContentQuery, useUpdateSectionContentMutation } from '@store/api/cmsApi';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '@store/slices/uiSlice';

const PAGES = [
  { id: 'home', label: 'Homepage' },
  { id: 'about', label: 'About Page' },
  { id: 'contact', label: 'Contact Page' },
  { id: 'global', label: 'Global (Footer/Nav)' }
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'mr', label: 'Marathi' },
  { code: 'es', label: 'Spanish' },
  { code: 'ar', label: 'Arabic' }
];

const SECTIONS_BY_PAGE = {
  home: [
    { id: 'hero', label: 'Hero Section', fields: ['title', 'subtitle', 'description', 'buttonText', 'buttonLink', 'imageUrl', 'imagesArray', 'videoUrl'] },
    { id: 'featured', label: 'Featured Properties Text', fields: ['title', 'subtitle', 'description', 'imagesArray'] },
    { id: 'stats', label: 'Platform Stats', fields: ['title', 'subtitle', 'description', 'imagesArray'] },
    { id: 'testimonials', label: 'Testimonials', fields: ['title', 'subtitle', 'testimonialsArray', 'imagesArray'] }
  ],
  about: [
    { id: 'hero', label: 'About Hero', fields: ['title', 'subtitle', 'imageUrl', 'videoUrl'] },
    { id: 'mission', label: 'Our Mission', fields: ['title', 'description', 'imageUrl', 'imagesArray', 'videoUrl'] },
    { id: 'features', label: 'Core Values/Features', fields: ['title', 'subtitle', 'featuresArray', 'imagesArray'] },
    { id: 'team', label: 'Our Team', fields: ['title', 'subtitle', 'description', 'imagesArray'] }
  ],
  contact: [
    { id: 'hero', label: 'Contact Hero', fields: ['title', 'subtitle', 'description', 'imageUrl', 'videoUrl'] },
    { id: 'info', label: 'Contact Information', fields: ['title', 'description', 'featuresArray', 'imagesArray'] }
  ],
  global: [
    { id: 'footer', label: 'Footer Settings', fields: ['title', 'description', 'imageUrl', 'imagesArray'] },
    { id: 'socials', label: 'Social Media Links', fields: ['featuresArray'] }
  ]
};

export default function AdminCms() {
  const [activePage, setActivePage] = useState('home');
  const [activeSection, setActiveSection] = useState('hero');
  const [activeLang, setActiveLang] = useState('en');
  const [uploadingField, setUploadingField] = useState(null);
  const dispatch = useDispatch();
  const authStateToken = useSelector(state => state.auth?.token || null);

  const { data: sectionData, isLoading: isFetching, refetch } = useGetSectionContentQuery(
    { page: activePage, section: activeSection },
    { refetchOnMountOrArgChange: true }
  );

  const [updateSection, { isLoading: isUpdating }] = useUpdateSectionContentMutation();

  const currentSectionConfig = SECTIONS_BY_PAGE[activePage]?.find(s => s.id === activeSection) || SECTIONS_BY_PAGE[activePage][0];

  const { register, control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      title: '', subtitle: '', description: '', buttonText: '', buttonLink: '', imageUrl: '', videoUrl: '',
      features: [], testimonials: [], images: [], translations: {}
    }
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control, name: 'features'
  });

  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({
    control, name: 'testimonials'
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control, name: 'images'
  });

  useEffect(() => {
    if (sectionData?.data?.content) {
      reset({
        title: sectionData.data.content.title || '',
        subtitle: sectionData.data.content.subtitle || '',
        description: sectionData.data.content.description || '',
        buttonText: sectionData.data.content.buttonText || '',
        buttonLink: sectionData.data.content.buttonLink || '',
        imageUrl: sectionData.data.content.imageUrl || '',
        videoUrl: sectionData.data.content.videoUrl || '',
        images: sectionData.data.content.images || [],
        features: sectionData.data.content.features || [],
        testimonials: sectionData.data.content.testimonials || [],
        translations: sectionData.data.content.translations || {}
      });
    } else {
      reset({
        title: '', subtitle: '', description: '', buttonText: '', buttonLink: '', imageUrl: '', videoUrl: '',
        images: [], features: [], testimonials: [], translations: {}
      });
    }
  }, [sectionData, reset, activePage, activeSection]);

  const getFieldName = (field) => activeLang === 'en' ? field : `translations.${activeLang}.${field}`;

  const handleFileUpload = async (event, fieldName, isArray = false) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingField(fieldName);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    formData.append('folder', `cms/${activePage}/${activeSection}`);

    try {
      const response = await fetch('/api/v1/upload/images', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authStateToken}` },
        body: formData
      });
      const data = await response.json();
      if (data.success && data.data?.length > 0) {
        if (isArray) {
          // If it's an array, append each uploaded url
          data.data.forEach(img => appendImage(img.url));
        } else {
          // If it's a single string field
          setValue(fieldName, data.data[0].url, { shouldDirty: true, shouldValidate: true });
        }
        dispatch(showToast({ type: 'success', message: 'Image uploaded successfully' }));
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message }));
    } finally {
      setUploadingField(null);
      event.target.value = ''; // Reset file input
    }
  };

  const handleVideoUpload = async (event, fieldName) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('folder', `cms/${activePage}/${activeSection}/videos`);

    try {
      const response = await fetch('/api/v1/upload/video', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authStateToken}` },
        body: formData
      });
      const data = await response.json();
      if (data.success && data.data?.url) {
        setValue(fieldName, data.data.url, { shouldDirty: true, shouldValidate: true });
        dispatch(showToast({ type: 'success', message: 'Video uploaded successfully' }));
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message }));
    } finally {
      setUploadingField(null);
      event.target.value = '';
    }
  };

  const onSubmit = async (data) => {
    try {
      // Clean up empty array items before saving
      const cleanedData = { ...data };
      if (cleanedData.features) {
         cleanedData.features = cleanedData.features.filter(f => f.title || f.description);
      }
      if (cleanedData.testimonials) {
         cleanedData.testimonials = cleanedData.testimonials.filter(t => t.name || t.text);
      }
      if (cleanedData.images) {
         // RHF might wrap string values in objects { value: '...' } depending on the version
         cleanedData.images = cleanedData.images.map(img => typeof img === 'object' ? Object.values(img)[0] : img).filter(img => img);
      }

      await updateSection({ page: activePage, section: activeSection, data: cleanedData }).unwrap();
      dispatch(showToast({ type: 'success', message: 'Content updated successfully' }));
      refetch();
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err?.data?.error?.message || 'Failed to update content' }));
    }
  };

  const hasField = (fieldName) => currentSectionConfig?.fields.includes(fieldName);

  return (
    <>
      <Helmet><title>CMS Management — RealEstate Pro</title></Helmet>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-[#111111]">Content Management</h1>
            <p className="text-gray-500 text-sm mt-1">Manage website text, images, and sections</p>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isUpdating || isFetching}
            className="flex items-center gap-2 bg-[#7C5CFF] hover:bg-[#6D28D9] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#7C5CFF]/25 disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Pages</h3>
              <div className="space-y-1">
                {PAGES.map(page => (
                  <button
                    key={page.id}
                    onClick={() => {
                      setActivePage(page.id);
                      setActiveSection(SECTIONS_BY_PAGE[page.id][0].id);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activePage === page.id ? 'bg-[#F0EEFF] text-[#7C5CFF]' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Sections</h3>
              <div className="space-y-1">
                {SECTIONS_BY_PAGE[activePage].map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                      activeSection === section.id ? 'bg-[#1A1A24] text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <DocumentTextIcon className={`w-4 h-4 ${activeSection === section.id ? 'text-[#7C5CFF]' : 'text-gray-400'}`} />
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Editor Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
              <div className="mb-6 pb-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#111111]">{currentSectionConfig?.label} Editing</h2>
                  <p className="text-gray-400 text-sm mt-1">Changes are live immediately upon saving.</p>
                </div>
                
                {/* Language Selector */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setActiveLang(lang.code)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        activeLang === lang.code ? 'bg-white text-[#7C5CFF] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {isFetching ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-8 h-8 border-4 border-[#7C5CFF] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  
                  {/* Basic Text Fields */}
                  <div className="grid grid-cols-1 gap-6">
                    {hasField('title') && (
                      <div>
                        <label className="block text-sm font-bold text-[#111111] mb-2">Title / Heading <span className="text-gray-400 uppercase text-[10px]">({activeLang})</span></label>
                        <input
                          type="text"
                          {...register(getFieldName('title'))}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7C5CFF]/20 focus:border-[#7C5CFF] transition-all"
                          placeholder="Enter main heading"
                        />
                      </div>
                    )}

                    {hasField('subtitle') && (
                      <div>
                        <label className="block text-sm font-bold text-[#111111] mb-2">Subtitle / Tagline <span className="text-gray-400 uppercase text-[10px]">({activeLang})</span></label>
                        <input
                          type="text"
                          {...register(getFieldName('subtitle'))}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7C5CFF]/20 focus:border-[#7C5CFF] transition-all"
                          placeholder="Enter subtitle or small text above heading"
                        />
                      </div>
                    )}

                    {hasField('description') && (
                      <div>
                        <label className="block text-sm font-bold text-[#111111] mb-2">Description <span className="text-gray-400 uppercase text-[10px]">({activeLang})</span></label>
                        <textarea
                          {...register(getFieldName('description'))}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7C5CFF]/20 focus:border-[#7C5CFF] transition-all"
                          placeholder="Enter detailed description"
                        />
                      </div>
                    )}
                  </div>

                  {/* Buttons & Links */}
                  {(hasField('buttonText') || hasField('buttonLink')) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                      {hasField('buttonText') && (
                        <div>
                          <label className="block text-sm font-bold text-[#111111] mb-2">Button Text <span className="text-gray-400 uppercase text-[10px]">({activeLang})</span></label>
                          <input
                            type="text"
                            {...register(getFieldName('buttonText'))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7C5CFF]/20 focus:border-[#7C5CFF] transition-all"
                            placeholder="e.g. Explore Now"
                          />
                        </div>
                      )}
                      {hasField('buttonLink') && (
                        <div>
                          <label className="block text-sm font-bold text-[#111111] mb-2">Button Link</label>
                          <input
                            type="text"
                            {...register('buttonLink')}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7C5CFF]/20 focus:border-[#7C5CFF] transition-all"
                            placeholder="e.g. /properties"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Image URL */}
                  {hasField('imageUrl') && (
                    <div className="pt-4 border-t border-gray-50">
                      <label className="block text-sm font-bold text-[#111111] mb-2">Main Image URL</label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="text"
                          {...register('imageUrl')}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7C5CFF]/20 focus:border-[#7C5CFF] transition-all"
                          placeholder="https://example.com/image.jpg"
                        />
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleFileUpload(e, 'imageUrl')} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploadingField === 'imageUrl'}
                          />
                          <button 
                            type="button" 
                            className="bg-[#111111] hover:bg-black text-white px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2"
                            disabled={uploadingField === 'imageUrl'}
                          >
                            <PhotoIcon className="w-5 h-5" />
                            {uploadingField === 'imageUrl' ? 'Uploading...' : 'Upload File'}
                          </button>
                        </div>
                      </div>
                      {watch('imageUrl') && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 max-w-sm h-48 bg-gray-50 flex items-center justify-center relative">
                          <img src={watch('imageUrl')} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none' }} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Video URL */}
                  {hasField('videoUrl') && (
                    <div className="pt-4 border-t border-gray-50">
                      <label className="block text-sm font-bold text-[#111111] mb-2">Video URL (MP4/WebM)</label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="text"
                          {...register('videoUrl')}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7C5CFF]/20 focus:border-[#7C5CFF] transition-all"
                          placeholder="https://example.com/video.mp4"
                        />
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="video/*" 
                            onChange={(e) => handleVideoUpload(e, 'videoUrl')} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploadingField === 'videoUrl'}
                          />
                          <button 
                            type="button" 
                            className="bg-[#111111] hover:bg-black text-white px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2"
                            disabled={uploadingField === 'videoUrl'}
                          >
                            <PlusIcon className="w-5 h-5" />
                            {uploadingField === 'videoUrl' ? 'Uploading...' : 'Upload Video'}
                          </button>
                        </div>
                      </div>
                      {watch('videoUrl') && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 max-w-sm bg-gray-50">
                          <video src={watch('videoUrl')} controls className="w-full h-48 object-cover" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Image Array */}
                  {hasField('imagesArray') && (
                    <div className="pt-6 border-t border-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-bold text-[#111111]">Gallery Images (URLs)</label>
                        <div className="flex gap-3">
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*" 
                              multiple
                              onChange={(e) => handleFileUpload(e, 'images', true)} 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={uploadingField === 'images'}
                            />
                            <button 
                              type="button" 
                              className="bg-[#F0EEFF] text-[#7C5CFF] hover:bg-[#E2DEFF] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                              disabled={uploadingField === 'images'}
                            >
                              <PhotoIcon className="w-4 h-4" />
                              {uploadingField === 'images' ? 'Uploading...' : 'Upload Files'}
                            </button>
                          </div>
                          <button type="button" onClick={() => appendImage('')} className="text-xs font-bold text-[#7C5CFF] flex items-center gap-1 hover:text-[#6D28D9]">
                            <PlusIcon className="w-4 h-4" /> Add URL
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {imageFields.map((field, index) => (
                          <div key={field.id} className="flex gap-4 items-center">
                            <input {...register(`images.${index}`)} placeholder="https://..." className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm w-full" />
                            {watch(`images.${index}`) && (
                              <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden shrink-0">
                                <img src={watch(`images.${index}`)} alt="" className="w-full h-full object-cover" onError={e=>e.target.style.display='none'}/>
                              </div>
                            )}
                            <button type="button" onClick={() => removeImage(index)} className="text-gray-400 hover:text-red-500 shrink-0">
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Array Fields (Features) */}
                  {hasField('featuresArray') && (
                    <div className="pt-6 border-t border-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-bold text-[#111111]">Features Items</label>
                        <button type="button" onClick={() => appendFeature({ title: '', description: '', icon: '' })} className="text-xs font-bold text-[#7C5CFF] flex items-center gap-1 hover:text-[#6D28D9]">
                          <PlusIcon className="w-4 h-4" /> Add Feature
                        </button>
                      </div>
                      <div className="space-y-4">
                        {featureFields.map((field, index) => (
                          <div key={field.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 relative group">
                            <button type="button" onClick={() => removeFeature(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <TrashIcon className="w-5 h-5" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                              <input {...register(activeLang === 'en' ? `features.${index}.title` : `translations.${activeLang}.features.${index}.title`)} placeholder={`Feature Title (${activeLang})`} className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full" />
                              <input {...register(`features.${index}.icon`)} placeholder="Icon identifier (e.g. 'home') - Global" className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full" />
                              <textarea {...register(activeLang === 'en' ? `features.${index}.description` : `translations.${activeLang}.features.${index}.description`)} placeholder={`Description (${activeLang})`} rows={2} className="md:col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm w-full" />
                            </div>
                          </div>
                        ))}
                        {featureFields.length === 0 && <p className="text-sm text-gray-400 italic">No features added yet.</p>}
                      </div>
                    </div>
                  )}

                  {/* Array Fields (Testimonials) */}
                  {hasField('testimonialsArray') && (
                    <div className="pt-6 border-t border-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-bold text-[#111111]">Testimonial Items</label>
                        <button type="button" onClick={() => appendTestimonial({ name: '', role: '', text: '', avatar: '' })} className="text-xs font-bold text-[#7C5CFF] flex items-center gap-1 hover:text-[#6D28D9]">
                          <PlusIcon className="w-4 h-4" /> Add Testimonial
                        </button>
                      </div>
                      <div className="space-y-4">
                        {testimonialFields.map((field, index) => (
                          <div key={field.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 relative group">
                            <button type="button" onClick={() => removeTestimonial(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <TrashIcon className="w-5 h-5" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                              <input {...register(activeLang === 'en' ? `testimonials.${index}.name` : `translations.${activeLang}.testimonials.${index}.name`)} placeholder={`Author Name (${activeLang})`} className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full" />
                              <input {...register(activeLang === 'en' ? `testimonials.${index}.role` : `translations.${activeLang}.testimonials.${index}.role`)} placeholder={`Role (${activeLang})`} className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full" />
                              <input {...register(`testimonials.${index}.avatar`)} placeholder="Avatar URL (Global)" className="md:col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm w-full" />
                              <textarea {...register(activeLang === 'en' ? `testimonials.${index}.text` : `translations.${activeLang}.testimonials.${index}.text`)} placeholder={`Review Text (${activeLang})`} rows={3} className="md:col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm w-full" />
                            </div>
                          </div>
                        ))}
                        {testimonialFields.length === 0 && <p className="text-sm text-gray-400 italic">No testimonials added yet.</p>}
                      </div>
                    </div>
                  )}

                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
