import { useState, useEffect, useRef, useCallback } from "react";

// Simple in-memory cache (module-scoped)
// This cache persists across component re-renders and unmounts/remounts
// It maps a key (url + options) to the response data and timestamp
const cache = new Map();

/**
 * Custom hook for data fetching with caching, race condition handling, and manual refetch support.
 * 
 * @param {string} url - The URL to fetch data from.
 * @param {object} options - Fetch options (method, headers, body, etc.).
 * @param {Array} deps - Dependency array to trigger refetching.
 * @returns {object} - { data, loading, error, refetch }
 */
export default function useFetch(url, options = {}, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Ref to track manual refetch triggers
  const refetchIndex = useRef(0);
  // Ref to track the latest fetch request and prevent race conditions
  const fetchToken = useRef(0);

  // Create a stable key for the cache based on URL and options
  const optionsString = JSON.stringify(options);
  const key = url ? `${url}|${optionsString}` : null;

  /**
   * The core fetching logic wrapped in useCallback.
   * Handles caching, network requests, and state updates.
   */
  const fetchNow = useCallback(async (signal) => {
    if (!url) return;

    // Increment token to identify this specific fetch request
    const currentToken = ++fetchToken.current;
    const hasCache = cache.has(key);

    // Return cached value if available and fresh
    if (hasCache) {
      const { data: cachedData, timestamp } = cache.get(key);
      const ttl = options.ttl || 5 * 60 * 1000; // Default 5 minutes
      const isFresh = Date.now() - timestamp < ttl;

      if (isFresh) {
        setData(cachedData);
        setLoading(false);
        return; // Exit early if cache is valid
      }
    }

    // Only show loading state if we don't already have a cached value (or if it's stale)
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { ...options, signal });
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      const json = await res.json();
      
      // Update cache with new data
      cache.set(key, { data: json, timestamp: Date.now() });
      
      // Only update state if this is still the latest request
      if (fetchToken.current === currentToken) {
        setData(json);
      }
    } catch (err) {
      // Ignore abort errors (cancelled requests)
      if (err.name !== "AbortError") setError(err.message || String(err));
    } finally {
      // Only turn off loading if this is still the latest request
      if (fetchToken.current === currentToken) {
        setLoading(false);
      }
    }
  }, [key, url, options]); // Re-create fetchNow when key, URL or options change

  // Effect to trigger the fetch when dependencies change
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    const signal = controller.signal;
    fetchNow(signal);
    
    // Cleanup function to abort the fetch if the component unmounts or deps change
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, fetchNow, refetchIndex.current, ...deps]);

  /**
   * Function to manually trigger a refetch.
   * Invalidates the cache for the current key and increments the refetch index.
   */
  const refetch = useCallback(() => {
    // invalidate this key and increment refetchIndex to re-run effect
    if (key) cache.delete(key);
    refetchIndex.current += 1;
    // force effect to re-run by updating refetchIndex (ref change)
    // component will pick this change via ref in deps list
  }, [key]);

  return { data, loading, error, refetch };
}