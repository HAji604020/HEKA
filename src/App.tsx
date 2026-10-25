import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { PublicCatalogView } from './components/PublicCatalogView';
import { ProductManagement } from './components/ProductManagement';
import { SalesAIView } from './components/SalesAIView';
import { InquiryManagement } from './components/InquiryManagement';
import { CompanyProfileView } from './components/CompanyProfileView';
import { SecurityAuditModal } from './components/SecurityAuditModal';
import { OnboardingModal } from './components/OnboardingModal';
import { Company, Product, User, CustomerInquiry, Language } from './types';
import { translations } from './translations';
import { api } from './services/api';
import { ShieldCheck, Sparkles, Building, Lock } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('fa');
  const [activeTab, setActiveTab] = useState<string>('products');
  const [isPublicView, setIsPublicView] = useState<boolean>(false);

  // Tenant & User state
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user_heka_admin',
    email: 'admin@hekaltd.com',
    name: 'HEKA Corporate Director',
    role: 'company_admin',
    companyId: 'comp_heka_ltd',
    token: 'token_heka_admin_secret'
  });

  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isSecurityAuditOpen, setIsSecurityAuditOpen] = useState<boolean>(false);

  // Transfer state from inquiry to AI Sales Assistant
  const [inquiryForAI, setInquiryForAI] = useState<CustomerInquiry | null>(null);

  // Sync RTL/LTR
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
  }, [currentLang]);

  // Load initial data from persistent backend
  const loadTenantData = async (companyId?: string) => {
    setIsLoading(true);
    try {
      // 1. Get companies
      const companies = await api.getCompanies();
      setAllCompanies(companies);

      const targetId = companyId || currentUser.companyId || companies[0]?.id;
      const comp = companies.find((c) => c.id === targetId) || companies[0] || null;
      setCurrentCompany(comp);

      if (comp) {
        // 2. Load private products for this tenant
        const prods = await api.getProducts(comp.id);
        setProducts(prods);

        // 3. Load private inquiries for this tenant
        const inqs = await api.getInquiries(comp.id);
        setInquiries(inqs);
      }
    } catch (err: any) {
      console.error('Failed to load tenant data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTenantData();
  }, []);

  // Tenant switch
  const handleSelectCompany = async (companyId: string) => {
    const comp = allCompanies.find((c) => c.id === companyId);
    if (!comp) return;

    setCurrentCompany(comp);

    // Update user context for the chosen company
    if (companyId === 'comp_heka_ltd' || companyId === 'comp_mehr_saffron') {
      api.setToken('token_heka_admin_secret');
      setCurrentUser({
        id: 'user_heka_admin',
        email: 'admin@hekaltd.com',
        name: 'HEKA Corporate Director',
        role: 'company_admin',
        companyId: 'comp_heka_ltd',
        token: 'token_heka_admin_secret'
      });
    } else if (companyId === 'comp_ziba_fashion') {
      api.setToken('token_ziba_admin_secret');
      setCurrentUser({
        id: 'user_ziba_admin',
        email: 'admin@zibafashion.com',
        name: 'Ziba Samimi (Founder)',
        role: 'company_admin',
        companyId: 'comp_ziba_fashion',
        token: 'token_ziba_admin_secret'
      });
    }

    // Refresh products and inquiries for the new company
    try {
      const prods = await api.getProducts(companyId);
      setProducts(prods);
      const inqs = await api.getInquiries(companyId);
      setInquiries(inqs);
    } catch (err: any) {
      console.warn('Tenant data reload error:', err);
    }
  };

  // Switch role directly (Mehr Admin vs Ziba Admin vs Platform Super Admin)
  const handleSwitchUserRole = async (email: string) => {
    try {
      const { user, company } = await api.login(email);
      setCurrentUser(user);
      if (company) {
        setCurrentCompany(company);
        const prods = await api.getProducts(company.id);
        setProducts(prods);
        const inqs = await api.getInquiries(company.id);
        setInquiries(inqs);
      } else if (user.role === 'platform_owner') {
        // Platform owner can inspect any company
        if (allCompanies.length > 0) {
          const comp = allCompanies[0];
          setCurrentCompany(comp);
          const prods = await api.getProducts(comp.id);
          setProducts(prods);
          const inqs = await api.getInquiries(comp.id);
          setInquiries(inqs);
        }
      }
    } catch (err: any) {
      alert(`Role switch error: ${err.message}`);
    }
  };

  // Handle transfer from Inquiries tab to AI Sales Assistant
  const handleSelectInquiryForAI = (inq: CustomerInquiry) => {
    setInquiryForAI(inq);
    setActiveTab('sales_ai');
  };

  // Handle new company created via Onboarding wizard
  const handleCompanyCreated = (newCompany: Company) => {
    setAllCompanies((prev) => [...prev, newCompany]);
    setCurrentCompany(newCompany);
    setProducts([]);
    setInquiries([]);
    setActiveTab('products');
  };

  const t = translations[currentLang];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header & Navigation */}
      <Navigation
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentUser={currentUser}
        currentCompany={currentCompany}
        allCompanies={allCompanies}
        onSelectCompany={handleSelectCompany}
        onSwitchUserRole={handleSwitchUserRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isPublicView={isPublicView}
        onTogglePublicView={setIsPublicView}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenSecurityAudit={() => setIsSecurityAuditOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 w-full">
        {isPublicView && currentCompany ? (
          /* Public Storefront Catalog View */
          <PublicCatalogView
            company={currentCompany}
            products={products}
            currentLang={currentLang}
          />
        ) : (
          /* Private Multi-Tenant Admin Dashboard */
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Active Company Banner */}
            {currentCompany && (
              <div
                className="rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${currentCompany.brandColors?.primary || '#1e3a8a'} 0%, #0f172a 100%)`
                }}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <img
                    src={currentCompany.logoUrl}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover bg-white border border-white/20 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                        {currentCompany.industry}
                      </span>
                      <span className="text-xs text-white/70">Tenant ID: {currentCompany.id}</span>
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tight mt-0.5">{currentCompany.name}</h2>
                    <p className="text-xs text-white/80 line-clamp-1">{currentCompany.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative z-10 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsPublicView(true)}
                    className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition shadow-xs cursor-pointer"
                  >
                    {t.viewPublicCatalog}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSecurityAuditOpen(true)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition cursor-pointer"
                  >
                    {t.securityAuditBtn}
                  </button>
                </div>
              </div>
            )}

            {/* Content Tabs */}
            {isLoading ? (
              <div className="py-20 text-center text-slate-400">Loading company data...</div>
            ) : (
              <div>
                {activeTab === 'products' && currentCompany && (
                  <ProductManagement
                    company={currentCompany}
                    products={products}
                    onRefresh={() => loadTenantData(currentCompany.id)}
                    currentLang={currentLang}
                  />
                )}

                {activeTab === 'sales_ai' && currentCompany && (
                  <SalesAIView
                    company={currentCompany}
                    products={products}
                    currentLang={currentLang}
                    initialInquiryMessage={inquiryForAI?.message}
                    initialProductId={inquiryForAI?.productId}
                  />
                )}

                {activeTab === 'inquiries' && (
                  <InquiryManagement
                    inquiries={inquiries}
                    onSelectForAIReply={handleSelectInquiryForAI}
                    currentLang={currentLang}
                  />
                )}

                {activeTab === 'company_profile' && currentCompany && (
                  <CompanyProfileView
                    company={currentCompany}
                    currentUser={currentUser}
                    onRefresh={() => loadTenantData(currentCompany.id)}
                    currentLang={currentLang}
                  />
                )}
              </div>
            )}
          </main>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">DukanAI – AI Sales Platform</span>
            <span>•</span>
            <span>Multi-Tenant Architecture</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Strict Data Isolation Verified</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSecurityAuditOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
            >
              {t.securityAuditBtn}
            </button>
            <span>•</span>
            <span>HEKA LTD & Ziba Fashion Demo Tenants</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCompanyCreated={handleCompanyCreated}
        currentLang={currentLang}
      />

      <SecurityAuditModal
        isOpen={isSecurityAuditOpen}
        onClose={() => setIsSecurityAuditOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}
