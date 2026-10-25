import React from 'react';
import { MessageSquare, Phone, MapPin, Package, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { CustomerInquiry, Language } from '../types';
import { translations } from '../translations';

interface InquiryManagementProps {
  inquiries: CustomerInquiry[];
  onSelectForAIReply: (inquiry: CustomerInquiry) => void;
  currentLang: Language;
}

export const InquiryManagement: React.FC<InquiryManagementProps> = ({
  inquiries,
  onSelectForAIReply,
  currentLang,
}) => {
  const t = translations[currentLang];

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg font-extrabold text-slate-900">{t.tabInquiries}</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {currentLang === 'fa'
            ? 'مدیریت استعلام‌های دریافتی از کاتالوگ عمومی و درخواست‌های پیش‌فاکتور عمده'
            : 'Manage buyer questions and wholesale quote requests submitted from your public storefront'}
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
          <MessageSquare className="w-12 h-12 mx-auto text-slate-300" />
          <p className="font-semibold text-slate-600">No customer inquiries yet.</p>
          <p className="text-xs">Incoming inquiries from your public catalog will appear here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      inq.inquiryType === 'wholesale_quote'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : inq.inquiryType === 'export_inquiry'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    {inq.inquiryType.toUpperCase().replace('_', ' ')}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{inq.customerName}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(inq.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{inq.customerContact}</span>
                </div>

                {inq.customerLocation && (
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{inq.customerLocation}</span>
                  </div>
                )}

                {inq.productName && (
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                    <Package className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">
                      {inq.productName} ({inq.requestedQuantity} units)
                    </span>
                  </div>
                )}
              </div>

              {/* Message text */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                {inq.message}
              </div>

              {/* Action */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => onSelectForAIReply(inq)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentLang === 'fa' ? 'پاسخ هوشمند با هوش مصنوعی' : 'Draft Reply with AI Sales Assistant'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
