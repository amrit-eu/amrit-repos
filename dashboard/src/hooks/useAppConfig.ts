import { useEffect, useState } from "react";

interface AppConfig {
  gatewayBaseUrl: string;
  publicSignupUrl: string;
}

let cachedConfig: AppConfig | null = null;
let configPromise: Promise<AppConfig> | null = null;
/**
 * Retrieves application configuration from /api/config.
 * Uses cache to avoid multiple requests
 */

export const useAppConfig = () => {
    const [config, setConfig] = useState<AppConfig | null>(cachedConfig);
    const [loading, setLoading] = useState(!cachedConfig);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
    // if alreaddy retrieve (cached), use it
    if (cachedConfig) {
      setConfig(cachedConfig);
      setLoading(false);
      return;
    }

    // if request to /api/config is already being made, we use it (avoid multiple request) :
    if (configPromise) {
        configPromise
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
        configPromise = null; // Reset for a retry
      });
    } else {
        configPromise = fetch('/api/config')
        .then(res => {
          if (!res.ok) {
            throw new Error(`Config fetch failed: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          cachedConfig = data;
          return data;
        });
    }

}, [])
    console.log(config)
    return { config, loading, error };
}