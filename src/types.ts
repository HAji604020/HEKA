export type Language = 'fa' | 'en';

export type UserRole = 'platform_owner' | 'company_admin' | 'company_staff';

export interface CompanyBrandColors {
  primary: string;
  accent: string;
  background?: string;
}

export interface CompanySettings {
  showRetailPricesPublicly: boolean;
  allowWholesaleQuoteRequests: boolean;
  supportedLanguages: Language[];
  defaultLanguage: Language;
  customGreetingEn?: string;
  customGreetingFa?: string;
}

export interface Company {
  id: string; // e.g. "comp_heka_ltd", "comp_ziba_fashion"
  slug: string; // e.g. "heka-ltd", "ziba-fashion"
  name: string;
  industry: string; // e.g. "Saffron & Agricultural Export", "Textile & Apparel", etc.
  country: string;
  currency: string;
  logoUrl: string;
  bannerUrl?: string;
  brandColors: CompanyBrandColors;
  contactPhone: string; // WhatsApp enabled phone
  contactEmail: string;
  address: string;
  plan: 'starter' | 'growth' | 'enterprise';
  settings: CompanySettings;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string | null; // null for platform_owner
  token: string;
}

export interface ProductPackageSize {
  id: string;
  name: string;
  weightOrSize: string; // e.g. "5g", "10g", "1kg" or "S", "M", "L", "XL"
  price: number;
  stock: number;
  isAvailable: boolean;
}

export interface ProductAttribute {
  key: string;
  value: string;
}

export interface WholesaleRules {
  minQuantity: number;
  discountPercent: number; // 0 if none
  requireQuote: boolean;
  termsNote: string;
  termsNoteFa?: string;
  isConfirmed: boolean;
}

export interface ShippingDetails {
  fee: string;
  transitTime: string;
  coverage: string;
  isConfirmed: boolean;
}

export interface QualityCertification {
  grade?: string;
  standard?: string; // e.g. ISO 3632, OEKO-TEX, GOTS
  labReportNumber?: string;
  isConfirmed: boolean;
  notes?: string;
}

export interface Product {
  id: string;
  companyId: string; // CRITICAL: Tenant ownership isolation key
  name: string;
  nameFa?: string;
  category: string;
  description: string;
  descriptionFa?: string;
  images: string[];
  unit: string; // e.g. "box", "piece", "gram", "meter", "kg"
  retailPrice: number;
  currency: string;
  stock: number;
  packageSizes: ProductPackageSize[];
  attributes: ProductAttribute[];
  wholesaleRules: WholesaleRules;
  shippingDetails: ShippingDetails;
  qualityInfo: QualityCertification;
  isPublished: boolean; // Public catalog visibility
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInquiry {
  id: string;
  companyId: string; // Strict Tenant Key
  customerName: string;
  customerContact: string; // Phone / WhatsApp / Email
  customerLocation?: string;
  inquiryType: 'retail_question' | 'wholesale_quote' | 'export_inquiry';
  productId?: string;
  productName?: string;
  requestedQuantity?: number;
  message: string;
  generatedReply?: string;
  replyLanguage: Language;
  status: 'new' | 'replied' | 'in_progress' | 'closed';
  createdAt: string;
}

export interface GeneratedSalesReply {
  text: string;
  language: Language;
  createdAt: string;
  factsUsed: string[];
  missingInfoWarnings: string[];
  hasUnconfirmedDetails: boolean;
  unconfirmedItems: string[];
  companyName: string;
  engineUsed: 'local' | 'gemini';
}

export interface SecurityAuditResult {
  testId: string;
  testName: string;
  testDescription: string;
  targetCompany: string;
  attackingCompany: string;
  actionAttempted: string;
  statusCodeReceived: number;
  expectedStatus: number;
  isIsolated: boolean;
  details: string;
}
