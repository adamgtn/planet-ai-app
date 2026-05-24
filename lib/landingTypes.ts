export type Benefit = {
  title: string;
  description: string;
  icon?: string; // emoji or lucide icon name
};

export type Testimonial = {
  name: string;
  role?: string;
  quote: string;
  photo_url?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type LandingPage = {
  id?: string;
  product: string; // PB record id of product
  headline: string;
  subheadline: string;
  hero_image_url?: string;
  cta_primary_text?: string;
  cta_primary_url?: string;
  benefits: Benefit[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  price_features: string[];
  footer_cta_text?: string;
  published: boolean;
};

export const emptyLanding = (): Omit<LandingPage, "product"> => ({
  headline: "",
  subheadline: "",
  hero_image_url: "",
  cta_primary_text: "Beli Sekarang",
  cta_primary_url: "",
  benefits: [],
  testimonials: [],
  faq: [],
  price_features: [],
  footer_cta_text: "",
  published: false,
});
