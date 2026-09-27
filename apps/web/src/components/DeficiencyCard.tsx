import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ChevronDown, ChevronUp, UploadCloud } from 'lucide-react';

interface DeficiencyProps {
  decisionId: string;
  field: string;
  message_en: string;
  message_hi: string;
  scoreBreakdown: any[];
}

export default function DeficiencyCard({ decisionId, field, message_en, message_hi, scoreBreakdown }: DeficiencyProps) {
  const { i18n, t } = useTranslation();
  const [explainOpen, setExplainOpen] = useState(false);

  const activeMessage = i18n.language === 'hi' ? message_hi : message_en;

  return (
    <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl overflow-hidden shadow-2xl my-4 text-white">
      {/* Alert Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4 flex items-start gap-3">
        <AlertCircle className="shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-lg leading-tight uppercase tracking-wide">
            {t('deficiency.actionRequired', 'Action Required')}
          </h3>
          <p className="text-white/90 text-sm font-medium mt-1">{activeMessage}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Fix & Resubmit Flow */}
        <button className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
          <UploadCloud size={20} />
          {t('deficiency.fixResubmit', 'Fix and Resubmit Document')}
        </button>

        {/* Explainable AI Toggle */}
        <div className="border-t border-white/10 pt-4">
          <button 
            onClick={() => setExplainOpen(!explainOpen)}
            className="flex items-center justify-between w-full text-sm font-semibold text-white/80 hover:text-white"
          >
            {t('deficiency.whyDecided', 'Why was this decided?')}
            {explainOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {/* Explainable AI Details view driven by GET /decisions/:id/explain */}
          {explainOpen && (
            <div className="mt-3 p-3 bg-black/20 rounded-lg text-sm text-white/70 space-y-2">
              <p className="font-medium text-white">Algorithm Trace:</p>
              <ul className="list-disc list-inside opacity-90 space-y-1 text-xs">
                {scoreBreakdown?.map((comp, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{comp.component}</span>
                    <span className="font-mono bg-white/10 px-1 rounded">{comp.points_awarded} pts</span>
                  </li>
                ))}
                <li className="text-red-300 mt-2">
                  Validation Failed: Required parameter {field} rejected.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
