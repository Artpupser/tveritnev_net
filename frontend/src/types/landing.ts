export interface HeroProps {
  title: string;
  description: string;
  buttonText: string;
  ctaText?: string;
}

export interface FeatureItem {
  title: string;
  text: string;
}

export interface FeaturesProps {
  items: FeatureItem[];
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

export interface PricingProps {
  title: string;
  plans: PricingPlan[];
}

export type SectionData = 
  | { type: 'hero'; props: HeroProps }
  | { type: 'features'; props: FeaturesProps }
  | { type: 'pricing'; props: PricingProps };