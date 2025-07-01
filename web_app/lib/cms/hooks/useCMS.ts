"use client";

import { useState, useEffect, useCallback } from "react";
import { getCMSClient, switchCMSProvider, getAvailableCMSProviders, getCurrentCMSProvider, CMSProvider, BaseCMSEntry, CMSQueryParams, CMSHookState, CMSHookHandlers, UseCMSProps } from "../index";

export function useCMS(): UseCMSProps {
  const [state, setState] = useState<CMSHookState>({
    isLoading: false,
    error: null,
    data: null,
    provider: getCurrentCMSProvider(),
  });

  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    try {
      const cmsClient = getCMSClient();
      setClient(cmsClient);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to initialize CMS client",
      }));
    }
  }, [state.provider]);

  const setProvider = useCallback((provider: CMSProvider) => {
    try {
      switchCMSProvider(provider);
      setState((prev) => ({ ...prev, provider, error: null }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to switch provider",
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // This is a placeholder - specific fetch logic should be implemented in specialized hooks
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Fetch failed",
      }));
    }
  }, []);

  const handlers: CMSHookHandlers = {
    refetch,
    setProvider,
    clearError,
  };

  return {
    state,
    handlers,
    client,
    isLoading: state.isLoading,
    error: state.error,
  };
}

export function useCMSStory(slug: string, params?: CMSQueryParams) {
  const [state, setState] = useState({
    isLoading: true,
    error: null as string | null,
    data: null as BaseCMSEntry | null,
    provider: getCurrentCMSProvider(),
  });

  const fetchStory = useCallback(async () => {
    if (!slug) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const client = getCMSClient();
      const response = await client.getStory(slug, params);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        data: response.data,
        provider: client.provider,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch story",
      }));
    }
  }, [slug, params]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  const refetch = useCallback(() => {
    fetchStory();
  }, [fetchStory]);

  const setProvider = useCallback(
    (provider: CMSProvider) => {
      try {
        switchCMSProvider(provider);
        setState((prev) => ({ ...prev, provider }));
        fetchStory();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to switch provider",
        }));
      }
    },
    [fetchStory]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    refetch,
    setProvider,
    clearError,
  };
}

export function useCMSStories(params?: CMSQueryParams) {
  const [state, setState] = useState({
    isLoading: true,
    error: null as string | null,
    stories: [] as BaseCMSEntry[],
    total: 0,
    pagination: null as any,
    provider: getCurrentCMSProvider(),
  });

  const fetchStories = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const client = getCMSClient();
      const response = await client.getStories(params);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        stories: response.stories,
        total: response.total,
        pagination: response.pagination,
        provider: client.provider,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch stories",
      }));
    }
  }, [params]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const refetch = useCallback(() => {
    fetchStories();
  }, [fetchStories]);

  const setProvider = useCallback(
    (provider: CMSProvider) => {
      try {
        switchCMSProvider(provider);
        setState((prev) => ({ ...prev, provider }));
        fetchStories();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to switch provider",
        }));
      }
    },
    [fetchStories]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    refetch,
    setProvider,
    clearError,
  };
}

export function useCMSGlobal() {
  const [state, setState] = useState({
    isLoading: true,
    error: null as string | null,
    navigation: null as any,
    footer: null as any,
    settings: null as any,
    provider: getCurrentCMSProvider(),
  });

  const fetchGlobalContent = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const client = getCMSClient();
      const [navigation, footer, settings] = await Promise.all([client.getNavigation().catch(() => ({ data: { items: [] } })), client.getFooter().catch(() => ({ data: {} })), client.getGlobalSettings().catch(() => ({ data: {} }))]);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        navigation: navigation.data,
        footer: footer.data,
        settings: settings.data,
        provider: client.provider,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch global content",
      }));
    }
  }, []);

  useEffect(() => {
    fetchGlobalContent();
  }, [fetchGlobalContent]);

  const refetch = useCallback(() => {
    fetchGlobalContent();
  }, [fetchGlobalContent]);

  const setProvider = useCallback(
    (provider: CMSProvider) => {
      try {
        switchCMSProvider(provider);
        setState((prev) => ({ ...prev, provider }));
        fetchGlobalContent();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to switch provider",
        }));
      }
    },
    [fetchGlobalContent]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    refetch,
    setProvider,
    clearError,
  };
}

// Provider info hook
export function useCMSProviders() {
  const [currentProvider, setCurrentProvider] = useState(getCurrentCMSProvider());
  const availableProviders = getAvailableCMSProviders();

  const switchProvider = useCallback((provider: CMSProvider) => {
    switchCMSProvider(provider);
    setCurrentProvider(provider);
  }, []);

  return {
    currentProvider,
    availableProviders,
    switchProvider,
    canSwitch: availableProviders.length > 1,
  };
}
