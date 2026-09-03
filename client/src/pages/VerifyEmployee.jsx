import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  User, 
  Briefcase, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  RefreshCw,
  Building2,
  ArrowRight
} from 'lucide-react';
import { resolveAssetUrl } from '../utils/cardDownloadUtils';

const VerifyEmployee = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlId = searchParams.get('id') || searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(urlId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const performVerification = async (queryToSearch) => {
    const trimmed = (queryToSearch || '').trim();
    if (!trimmed) {
      setErrorMsg('Please enter an Employee ID, Application ID, Email, or Mobile number');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setSearched(true);
    setResult(null);

    try {
      const cleanParam = encodeURIComponent(trimmed);
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/application/status/${cleanParam}`);
      const data = await res.json();

      if (res.ok && data.success && data.employee) {
        setResult(data);
      } else {
        setErrorMsg(data.message || 'No employee or applicant record found with this ID.');
      }
    } catch (err) {
      console.error('Verification Error:', err);
      setErrorMsg('Unable to connect to the verification server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlId) {
      setSearchQuery(urlId);
      performVerification(urlId);
    }
  }, [urlId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ id: searchQuery.trim() });
      performVerification(searchQuery.trim());
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setResult(null);
    setSearched(false);
    setErrorMsg('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-[#ED1C24] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
            <ShieldCheck className="w-4 h-4" /> Official Public Verification Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Employee & Staff <span className="text-[#ED1C24]">ID Verification</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium">
            Verify the active status of any Aagaj Foundation staff, field officer, or project coordinator in real-time to protect against unauthorized representation and fraud.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 mb-8 transition-all">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Enter Employee ID / Application ID / Mobile / Email
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. AF-1024, EMP0001, or 9876543210"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#ED1C24] hover:bg-[#b0151b] text-white font-black text-sm tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" /> Verify ID
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Examples */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-700">Quick Tips:</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">ID Format: AF-XXXX or EMPXXXX</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">Enter Registered Mobile / Email</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-8 rounded-2xl bg-rose-50 border border-rose-200 p-5 text-rose-900 flex items-start gap-3 shadow-sm animate-fade-in">
            <ShieldAlert className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold">Verification Notice</h3>
              <p className="text-xs sm:text-sm mt-1 text-rose-700">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Verification Result Card */}
        {result && result.employee && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Status Announcement Banner */}
            {result.isActive ? (
              <div className="rounded-2xl bg-emerald-500 text-white p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shrink-0">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <span className="inline-block bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
                      Official Record
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black">VERIFIED ACTIVE EMPLOYEE</h2>
                    <p className="text-xs sm:text-sm text-emerald-50 mt-0.5 font-medium">
                      This person is currently an authorized active representative of Aagaj Foundation.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 bg-white text-emerald-800 font-black px-4 py-2 rounded-xl text-sm shadow">
                  STATUS: ACTIVE
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#ED1C24] text-white p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-rose-700">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shrink-0">
                    <AlertTriangle className="h-8 w-8 text-white animate-bounce" />
                  </div>
                  <div>
                    <span className="inline-block bg-white text-rose-700 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm">
                      Security Alert
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">ID DEACTIVATED / INACTIVE</h2>
                    <p className="text-xs sm:text-sm text-rose-100 mt-0.5 font-medium">
                      WARNING: This employee is NO LONGER authorized to represent or collect funds for Aagaj Foundation.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 bg-white text-rose-700 font-black px-4 py-2 rounded-xl text-sm shadow">
                  STATUS: DEACTIVATED
                </div>
              </div>
            )}

            {/* Detailed Profile Box */}
            <div className={`bg-white rounded-3xl shadow-xl overflow-hidden border-2 transition-all ${result.isActive ? 'border-emerald-200' : 'border-rose-300'}`}>
              
              {/* Header Bar */}
              <div className={`py-4 px-6 sm:px-8 flex flex-wrap items-center justify-between gap-4 border-b ${result.isActive ? 'bg-emerald-50/60 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                <div className="flex items-center gap-2 font-black text-slate-800 text-sm sm:text-base">
                  <Building2 className="h-5 w-5 text-[#ED1C24]" /> Aagaj Foundation Verification Record
                </div>
                <div className="text-xs font-bold text-slate-500">
                  ID: <span className="text-slate-900 font-black">{result.employee.uniqueId}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  
                  {/* Photo / Avatar */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative">
                      <img
                        src={result.employee.photoPath ? resolveAssetUrl(result.employee.photoPath) : '/logo.jpg'}
                        alt={result.employee.fullName}
                        className={`w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-lg border-4 ${result.isActive ? 'border-emerald-500' : 'border-rose-500'}`}
                        onError={(e) => { e.target.src = '/logo.jpg'; }}
                      />
                      <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-full text-white shadow-md ${result.isActive ? 'bg-emerald-500' : 'bg-rose-600'}`}>
                        {result.isActive ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                      </div>
                    </div>

                    <span className={`mt-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${result.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {result.isActive ? '● Active Staff' : '● Deactivated'}
                    </span>
                  </div>

                  {/* Profile Details Grid */}
                  <div className="flex-grow w-full">
                    <div className="border-b border-slate-100 pb-4 mb-5 text-center md:text-left">
                      <h3 className="text-2xl font-black text-slate-900">{result.employee.fullName}</h3>
                      <p className="text-sm font-bold text-[#ED1C24] uppercase tracking-wider mt-0.5">
                        {result.employee.designation || 'Staff Member'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Employee / Pravesh ID
                        </span>
                        <span className="font-extrabold text-slate-900 text-base">{result.employee.uniqueId}</span>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Role Category
                        </span>
                        <span className="font-extrabold text-slate-900">{result.employee.jobCategory || 'NGO Foundation'}</span>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Location / District
                        </span>
                        <span className="font-extrabold text-slate-900 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {result.employee.district}, {result.employee.state}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Registration / Joining Date
                        </span>
                        <span className="font-extrabold text-slate-900 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {result.employee.joiningDate 
                            ? new Date(result.employee.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                            : 'Verified'}
                        </span>
                      </div>

                    </div>

                    {/* DEACTIVATION DATE HIGHLIGHT */}
                    {!result.isActive && (
                      <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-black uppercase tracking-wider text-rose-900">
                              Deactivation Information
                            </p>
                            <p className="text-sm font-bold text-rose-700 mt-0.5">
                              This ID was deactivated on:{' '}
                              <span className="underline font-black text-rose-900">
                                {result.deactivatedAt 
                                  ? new Date(result.deactivatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) 
                                  : 'Previously Deactivated by Admin'}
                              </span>
                            </p>
                            <p className="text-xs text-rose-600 mt-2 font-medium">
                              Public Notice: Please do not engage in any official correspondence, monetary collections, or document submission with this individual regarding Aagaj Foundation.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </div>

              {/* Footer action bar */}
              <div className="bg-slate-50 p-4 sm:px-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-semibold">
                  <PhoneCall className="h-4 w-4 text-[#ED1C24]" /> Official Support Helpline: <strong>+91 9431430464</strong>
                </div>
                <button
                  onClick={handleReset}
                  className="text-slate-600 hover:text-[#ED1C24] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Verify Another ID <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmployee;
