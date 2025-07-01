export interface HeroSectionInterface {
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  background_image?: string;
}

export interface ServiceCardInterface {
  id: number;
  title: string;
  description: string;
  icon: string;
  link: string;
}

export interface AlertInterface {
  id: number;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  link?: string;
}

export interface HomePageStateInterface {
  hero: HeroSectionInterface;
  services: ServiceCardInterface[];
  alerts: AlertInterface[];
  isLoading: boolean;
  error: string | null;
}

export interface HomePageHandlersType {
  onServiceClick: (service: ServiceCardInterface) => void;
  onAlertClick: (alert: AlertInterface) => void;
  onHeroCtaClick: () => void;
  onDismissAlert: (alertId: number) => void;
}

export type HomePageProps = {
  state: HomePageStateInterface;
  handlers?: HomePageHandlersType;
};

export const NAVIGATION_LINKS = [
  { href: "/outages", label: "Outages" },
  { href: "/account", label: "My Account" },
  { href: "/billing", label: "Pay Bill" },
  { href: "/programs", label: "Programs" },
  { href: "/safety", label: "Safety" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  customer: [
    { href: "/account/start-service", label: "Start Service" },
    { href: "/account/stop-service", label: "Stop Service" },
    { href: "/account/move-service", label: "Move Service" },
    { href: "/billing/payment-options", label: "Payment Options" },
  ],
  programs: [
    { href: "/programs/energy-efficiency", label: "Energy Efficiency" },
    { href: "/programs/budget-billing", label: "Budget Billing" },
    { href: "/programs/low-income", label: "Customer Assistance" },
    { href: "/programs/renewable", label: "Renewable Energy" },
  ],
  company: [
    { href: "/about", label: "About PPL" },
    { href: "/investors", label: "Investors" },
    { href: "/careers", label: "Careers" },
    { href: "/newsroom", label: "Newsroom" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/accessibility", label: "Accessibility" },
    { href: "/tariffs", label: "Tariffs" },
  ],
} as const;

export const PPL_CONSTANTS = {
  COMPANY_NAME: "PPL Electric Utilities",
  CUSTOMER_COUNT: "1.4 million",
  SERVICE_AREA: "29 counties in Pennsylvania",
  PHONE_CUSTOMER_SERVICE: "1-800-DIAL-PPL",
  PHONE_EMERGENCY: "1-800-DIAL-PPL",
  SOCIAL_MEDIA: {
    FACEBOOK: "https://www.facebook.com/PPLElectricUtilities",
    TWITTER: "https://twitter.com/PPLElectric",
    YOUTUBE: "https://www.youtube.com/user/PPLElectricUtilities",
    LINKEDIN: "https://www.linkedin.com/company/ppl-corporation",
  },
} as const;
