import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertInterface, ServiceCardInterface, HeroSectionInterface } from "../../app/config";

export function getAlertClasses(type: string) {
  const alertStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };
  return alertStyles[type as keyof typeof alertStyles] || alertStyles.info;
}

export function getServiceIconClasses(icon: string) {
  const iconStyles = {
    power: "text-blue-600",
    "credit-card": "text-green-600",
    leaf: "text-emerald-600",
    home: "text-indigo-600",
  };
  return iconStyles[icon as keyof typeof iconStyles] || "text-gray-600";
}

export function getButtonVariantClasses(variant: string) {
  const buttonStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors",
    secondary: "bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 font-semibold px-6 py-3 rounded-lg transition-colors",
    ghost: "text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg transition-colors",
  };
  return buttonStyles[variant as keyof typeof buttonStyles] || buttonStyles.primary;
}

export function AlertComponent({ alert, onDismiss }: { alert: AlertInterface; onDismiss?: (id: number) => void }) {
  return (
    <div className={`border-l-4 p-4 ${getAlertClasses(alert.type)}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium">{alert.title}</h3>
          <p className="mt-1 text-sm">{alert.message}</p>
          {alert.link && (
            <Link href={alert.link} className="mt-2 text-sm font-medium hover:underline inline-block">
              Learn more →
            </Link>
          )}
        </div>
        {onDismiss && (
          <button onClick={() => onDismiss(alert.id)} className="ml-4 p-1 hover:bg-white hover:bg-opacity-20 rounded" aria-label="Dismiss alert">
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export function ServiceCard({ service, onClick }: { service: ServiceCardInterface; onClick?: (service: ServiceCardInterface) => void }) {
  const handleClick = () => {
    if (onClick) {
      onClick(service);
    }
  };

  const CardWrapper = onClick ? "button" : "div";
  const linkProps = onClick ? {} : { href: service.link };

  return (
    <CardWrapper {...(onClick ? { onClick: handleClick } : {})} className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:scale-105 ${onClick ? "cursor-pointer" : ""}`}>
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${getServiceIconClasses(service.icon)}`}>
          <ServiceIcon icon={service.icon} />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
      {!onClick && (
        <Link href={service.link} className="text-blue-600 font-medium text-sm hover:underline">
          Get started →
        </Link>
      )}
    </CardWrapper>
  );
}

export function ServiceIcon({ icon }: { icon: string }) {
  const iconMap = {
    power: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    "credit-card": (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    leaf: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    home: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  };

  return iconMap[icon as keyof typeof iconMap] || iconMap.power;
}

export function HeroSection({ hero, onCtaClick }: { hero: HeroSectionInterface; onCtaClick?: () => void }) {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{hero.title}</h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">{hero.subtitle}</p>
          <p className="text-lg mb-8 text-blue-50 max-w-2xl mx-auto">{hero.description}</p>
          <button onClick={onCtaClick} className={getButtonVariantClasses("primary")}>
            {hero.cta_text}
          </button>
        </div>
      </div>
    </div>
  );
}

export function NavigationHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">PPL</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">PPL Electric</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/outages" className="text-gray-700 hover:text-blue-600 font-medium">
              Outages
            </Link>
            <Link href="/account" className="text-gray-700 hover:text-blue-600 font-medium">
              My Account
            </Link>
            <Link href="/billing" className="text-gray-700 hover:text-blue-600 font-medium">
              Pay Bill
            </Link>
            <Link href="/programs" className="text-gray-700 hover:text-blue-600 font-medium">
              Programs
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600">
              <span className="sr-only">Search</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="md:hidden text-gray-700 hover:text-blue-600">
              <span className="sr-only">Menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function PageFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded mr-3 flex items-center justify-center">
                <span className="text-white font-bold">PPL</span>
              </div>
              <span className="text-xl font-semibold">PPL Electric Utilities</span>
            </div>
            <p className="text-gray-300 mb-4">Serving over 1.4 million customers across 29 counties in Pennsylvania with safe, reliable, and affordable electricity.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account/start-service" className="text-gray-300 hover:text-white">
                  Start Service
                </Link>
              </li>
              <li>
                <Link href="/account/stop-service" className="text-gray-300 hover:text-white">
                  Stop Service
                </Link>
              </li>
              <li>
                <Link href="/billing" className="text-gray-300 hover:text-white">
                  Pay Bill
                </Link>
              </li>
              <li>
                <Link href="/outages" className="text-gray-300 hover:text-white">
                  Report Outages
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About PPL
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-gray-300 hover:text-white">
                  Investors
                </Link>
              </li>
              <li>
                <Link href="/newsroom" className="text-gray-300 hover:text-white">
                  Newsroom
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 PPL Electric Utilities. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
