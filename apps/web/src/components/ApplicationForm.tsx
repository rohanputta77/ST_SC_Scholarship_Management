import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { get, set } from 'idb-keyval';
import imageCompression from 'browser-image-compression';

export default function ApplicationForm() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({ name: '', dob: '' });
  const [docs, setDocs] = useState([]);

  // IndexedDB Resumable Draft
  useEffect(() => {
    get('appDraft').then((val: any) => val && setFormData(val));
  }, []);

  const handleBlur = () => set('appDraft', formData);

  // DigiLocker Mock
  const fetchFromDigiLocker = async () => {
    const syntheticDocs = await fetch('/api/digilocker-mock').then(res => res.json());
    setDocs(syntheticDocs);
  };

  // Camera + Client Compression
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
    // Upload compressed file logic...
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 p-4 text-white">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('header.title')}</h1>
        <button 
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
          className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold"
        >
          {i18n.language === 'en' ? 'HI' : 'EN'}
        </button>
      </header>
      
      {/* Draft State Indicator */}
      <div className="text-sm text-green-300 mb-4">{t('form.draftSaved')}</div>

      <main className="space-y-6">
        {/* Glassmorphism Form Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl mb-4 font-semibold">{t('form.personalDetails')}</h2>
          
          <input
            type="text"
            value={formData.name}
            onBlur={handleBlur}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('form.namePlaceholder')}
            className="w-full bg-white/5 border border-white/30 rounded-lg p-3 mb-4 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          
          <input
            type="date"
            value={formData.dob}
            onBlur={handleBlur}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="w-full bg-white/5 border border-white/30 rounded-lg p-3 mb-4 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Documents Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{t('form.documents') || 'Required Documents'}</h2>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">NFST Scheme</span>
          </div>
          
          <div className="bg-black/20 p-4 rounded-xl text-sm mb-4 space-y-2 border border-white/5">
            <p className="text-gray-300 font-semibold mb-2">Please ensure you have the following ready:</p>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>ST Certificate (Digitally signed or issued by Tehsildar)</li>
              <li>Income Certificate</li>
              <li>Master's Degree Marks Sheet (Minimum 55%)</li>
              <li>NET/CSIR-NET Score Card</li>
              <li>Aadhaar Card / Identity Proof</li>
            </ul>
            <p className="text-xs text-blue-300 mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Pro Tip: Use DigiLocker to auto-clear verification instantly.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={fetchFromDigiLocker}
              className="bg-blue-600 hover:bg-blue-500 transition-colors p-3 rounded-xl flex items-center justify-center font-semibold"
            >
              Fetch DigiLocker
            </button>
            
            <label className="bg-purple-600 hover:bg-purple-500 transition-colors p-3 rounded-xl flex items-center justify-center font-semibold cursor-pointer">
              Camera Capture
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCameraCapture} />
            </label>
          </div>
        </div>
      </main>
    </div>
  );
}
