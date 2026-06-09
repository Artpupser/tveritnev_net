export interface HeroProps {
  title: string;
  description: string;
  buttonText?: string;
  videoUrl?: string;
}

export interface SocialLink {
  name: string;
  url: string;
}

export interface AboutProps {
  avatarUrl: string;
  name: string;
  skills: string[];
  badges: string[];
  socials: SocialLink[];
}

export interface SwitcherPlan {
  name: string;
  price: string;
  features: string[];
}

export interface ServiceBlock {
  title: string;
  description: string;
  phone: string;
  vkUrl: string;
  maxUrl: string;
  tgUrl: string;
  plans: SwitcherPlan[];
}

export interface ServiceSwitcherProps {
  english: ServiceBlock;
  guide: ServiceBlock;
}

export interface ReviewItem {
  text: string;
  author: string;
}

export interface ReviewsProps {
  title: string;
  row1: ReviewItem[];
  row2: ReviewItem[];
  row3: ReviewItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQProps {
  title: string;
  items: FAQItem[];
}

export type SectionData = 
  | { type: 'hero'; props: HeroProps }
  | { type: 'about'; props: AboutProps }
  | { type: 'serviceSwitcher'; props: ServiceSwitcherProps }
  | { type: 'reviews'; props: ReviewsProps }
  | { type: 'faq'; props: FAQProps };