import { useState, useEffect } from "react";
import { HomePageStateInterface, HomePageHandlersType, ServiceCardInterface, AlertInterface } from "../../app/config";
import { mockStoryblokData } from "../cms";

export function useHomePage() {
  const [state, setState] = useState<HomePageStateInterface>({
    hero: mockStoryblokData.hero,
    services: mockStoryblokData.services,
    alerts: mockStoryblokData.alerts,
    isLoading: false,
    error: null,
  });

  const handlers: HomePageHandlersType = {
    onServiceClick: (service: ServiceCardInterface) => {
      if (typeof window !== "undefined") {
        window.location.href = service.link;
      }
    },

    onAlertClick: (alert: AlertInterface) => {
      if (alert.link && typeof window !== "undefined") {
        window.location.href = alert.link;
      }
    },

    onHeroCtaClick: () => {
      if (typeof window !== "undefined") {
        window.location.href = "/about";
      }
    },

    onDismissAlert: (alertId: number) => {
      setState((prevState) => ({
        ...prevState,
        alerts: prevState.alerts.filter((alert) => alert.id !== alertId),
      }));
    },
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setState((prevState) => ({ ...prevState, isLoading: false }));
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: "Failed to load page content. Please refresh the page.",
        }));
      }
    };

    loadInitialData();
  }, []);

  return {
    state,
    handlers,
  };
}
