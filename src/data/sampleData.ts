import { Product, Company } from '../types';

export interface CommercialProductInfo {
  name: string;
  weightGrams: string;
  price: string;
  currency: string;
  stock: string;
  packaging: string;
  qualityLabInfo: string;
  shipping: string;
  wholesaleTerms: string;
  isDemo?: boolean;
}

export interface CommercialScenario {
  id: string;
  labelEn: string;
  labelFa: string;
  category: 'preset' | 'test_case';
  product: CommercialProductInfo;
  customerMessageEn: string;
  customerMessageFa: string;
  testDescriptionEn?: string;
  testDescriptionFa?: string;
}

export const defaultDemoProduct: CommercialProductInfo = {
  name: 'HEKA Signature Reserve Luxury Gift Collection',
  weightGrams: 'Standard Set',
  price: '48',
  currency: '$',
  stock: '50',
  packaging: 'Luxury handcrafted velvet-lined executive presentation case featuring airtight crystal vials with tamper-evident seal and precision brass dispenser.',
  qualityLabInfo: 'Confirmed Grade 1 ISO Certified (ISO 9001 / ISO 22000 Batch HEKA-QC-2026-778). Full purity and traceability verified.',
  shipping: 'UK & Europe: Free priority courier within 24-48 hours. International DHL Express export worldwide in 3-5 business days.',
  wholesaleTerms: 'Minimum wholesale order: 10 units. 12% commercial discount on orders of 20+ units.',
  isDemo: true
};

export const sampleScenarios: CommercialScenario[] = [
  {
    id: 'heka_executive_gift',
    labelEn: '🎁 HEKA Executive Gift Set ($48 - DEMO)',
    labelFa: '🎁 بسته لوکس کلکسیون HEKA LTD (۴۸ دالر - آزمایشی)',
    category: 'preset',
    product: defaultDemoProduct,
    customerMessageEn: 'Hello! I am interested in purchasing your HEKA Signature Reserve Gift Collection for our corporate clients. What is the total with express shipping to London?',
    customerMessageFa: 'سلام و احترام، بسته کلکسیون اختصاصی HEKA LTD را برای هدایای شرکتی نیاز داریم. آیا موجود دارید و هزینه نهایی با ارسال چقدر است؟'
  }
];
