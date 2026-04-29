import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ChatBubbleBottomCenterTextIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useGetAdminLeadByIdQuery, useUpdateLeadStatusMutation, useAddLeadNoteMutation } from '@store/api/adminApi';
import { useDispatch } from 'react-redux';
import { showToast } from '@store/slices/uiSlice';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-amber-100 text-amber-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  { value: 'interested', label: 'Interested', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'site-visit-scheduled', label: 'Site Visit', color: 'bg-purple-100 text-purple-700' },
  { value: 'closed', label: 'Closed/Won', color: 'bg-green-100 text-green-700' },
  { value: 'lost', label: 'Lost', color: 'bg-rose-100 text-rose-700' },
];

export default function AdminLeadDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetAdminLeadByIdQuery(id);
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateLeadStatusMutation();
  const [addNote, { isLoading: isAddingNote }] = useAddLeadNoteMutation();
  
  const [noteText, setNoteText] = useState('');
  const lead = data?.data;

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      dispatch(showToast({ type: 'success', message: `Status updated to ${newStatus}` }));
    } catch (err) {
      dispatch(showToast({ type: 'error', message: 'Failed to update status' }));
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      await addNote({ id, text: noteText }).unwrap();
      setNoteText('');
      dispatch(showToast({ type: 'success', message: 'Note added' }));
    } catch (err) {
      dispatch(showToast({ type: 'error', message: 'Failed to add note' }));
    }
  };

  if (isLoading) return <div className="py-20 text-center text-slate-400">Loading lead details...</div>;
  if (error || !lead) return <div className="py-20 text-center text-red-500 font-bold">Lead not found or error occurred.</div>;

  return (
    <>
      <Helmet><title>{lead.name} — Lead Detail | Admin</title></Helmet>

      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/leads" className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-[28px] font-bold text-[#111111]">{lead.name}</h1>
              <p className="text-[13px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                <ClockIcon className="w-4 h-4" /> Received on {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdatingStatus}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#111111] focus:ring-2 focus:ring-[#D4A853] outline-none shadow-sm"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Contact & Property */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info Card */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 space-y-6">
              <h3 className="text-[16px] font-bold text-[#111111] border-b border-gray-50 pb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="text-[15px] font-bold text-[#111111]">{lead.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-[15px] font-bold text-[#111111]">{lead.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Source</p>
                    <p className="text-[15px] font-bold text-[#111111] capitalize">{lead.source?.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full py-3 bg-[#111111] text-white text-sm font-bold rounded-xl hover:bg-black transition-colors shadow-sm active:scale-95">
                  Call Now
                </button>
              </div>
            </div>

            {/* Property Link Card */}
            {lead.property && (
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                  <h3 className="text-[16px] font-bold text-[#111111]">Interested Property</h3>
                </div>
                <div className="relative aspect-video">
                  <img src={lead.property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'} className="w-full h-full object-cover" alt="" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[11px] font-bold text-[#111111]">
                    ₹{lead.property.price >= 10000000 ? (lead.property.price / 10000000).toFixed(2) + ' Cr' : (lead.property.price / 100000).toFixed(1) + ' L'}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h4 className="text-[15px] font-bold text-[#111111] line-clamp-1">{lead.property.title}</h4>
                  <div className="flex items-center gap-2 text-[13px] text-gray-500">
                    <BuildingOfficeIcon className="w-4 h-4" />
                    <span>{lead.property.location?.city}</span>
                  </div>
                  <Link to={`/properties/${lead.property.slug}`} target="_blank" className="block w-full py-3 bg-gray-50 text-[#111111] text-center text-sm font-bold rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                    View Property Details
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Timeline & Notes */}
          <div className="lg:col-span-2 space-y-8">
            {/* Notes Section */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
              <h3 className="text-[18px] font-bold text-[#111111] mb-6">Internal Notes</h3>
              
              <form onSubmit={handleAddNote} className="mb-8">
                <div className="relative">
                  <textarea 
                    placeholder="Add a private note about this lead..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl p-6 text-[14px] text-[#111111] outline-none focus:ring-2 focus:ring-[#D4A853] transition-all resize-none"
                  />
                  <button 
                    type="submit"
                    disabled={isAddingNote || !noteText.trim()}
                    className="absolute bottom-4 right-4 bg-[#D4A853] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#C29742] transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isAddingNote ? 'Saving...' : 'Post Note'}
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.slice().reverse().map((note, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-gray-500">
                        {note.addedBy?.name?.[0] || 'A'}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-bold text-[#111111]">{note.addedBy?.name || 'Admin'}</span>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {new Date(note.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[14px] text-gray-600 leading-relaxed">{note.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 italic text-sm">No notes added yet.</div>
                )}
              </div>
            </div>

            {/* Lead Status Timeline */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
              <h3 className="text-[18px] font-bold text-[#111111] mb-8">Status History</h3>
              <div className="space-y-8 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-50">
                {lead.statusHistory && lead.statusHistory.length > 0 ? (
                  lead.statusHistory.slice().reverse().map((history, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-gray-50 flex items-center justify-center z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-bold text-[#111111]">Status changed to</span>
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${STATUS_OPTIONS.find(o => o.value === history.status)?.color}`}>
                            {history.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-[12px] text-gray-400 font-medium">
                          By {history.changedBy?.name || 'System'} • {new Date(history.changedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {history.note && (
                          <p className="mt-2 text-[13px] text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">{history.note}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-gray-50 flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#111111]">Lead Created</p>
                      <p className="text-[12px] text-gray-400 font-medium">
                        {new Date(lead.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
