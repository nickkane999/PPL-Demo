"use client";

import { HomePageProps } from "./config";
import { NavigationHeader, HeroSection, ServiceCard, AlertComponent, PageFooter } from "../lib/ui/ui";
import { useHomePage } from "../lib/hooks/useHomePage";

export default function HomePage({ props }: { props?: HomePageProps }) {
  const homePageData = useHomePage();

  if (!props && !homePageData) {
    console.error("HomePage: props is undefined and hook data unavailable");
    return null;
  }

  const { state, handlers } = props || homePageData;

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PPL Electric...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      {state.alerts.length > 0 && (
        <div className="bg-yellow-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            {state.alerts.map((alert) => (
              <AlertComponent key={alert.id} alert={alert} onDismiss={handlers?.onDismissAlert} />
            ))}
          </div>
        </div>
      )}

      <HeroSection hero={state.hero} onCtaClick={handlers?.onHeroCtaClick} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Manage your electric service, report outages, pay bills, and discover energy-saving programs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {state.services.map((service) => (
            <ServiceCard key={service.id} service={service} onClick={handlers?.onServiceClick} />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-6">Our customer service team is available 24/7 to assist with outages, billing questions, and service requests.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:1-800-342-5775" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Call 1-800-DIAL-PPL
            </a>
            <a href="/contact" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 font-semibold px-6 py-3 rounded-lg transition-colors">
              Contact Us Online
            </a>
          </div>
        </div>
      </main>

      <PageFooter />
    </div>
  );
}
