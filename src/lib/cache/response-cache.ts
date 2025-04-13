interface CacheItem<T> {
  value: T;
  expiry: number;
}

type CacheMap<T> = Map<string, CacheItem<T>>;

/**
 * Simple in-memory cache implementation with expiration
 */
export class ResponseCache {
  private static instance: ResponseCache;
  private caches: Map<string, CacheMap<any>> = new Map();
  
  /**
   * Get singleton instance of the cache
   */
  public static getInstance(): ResponseCache {
    if (!ResponseCache.instance) {
      ResponseCache.instance = new ResponseCache();
    }
    return ResponseCache.instance;
  }
  
  /**
   * Get a cached value or execute the function to get the value, cache and return it
   * @param cacheName The name of the cache to use
   * @param key The cache key
   * @param fn The function to execute if value is not cached
   * @param ttlSeconds Time to live in seconds
   * @returns The cached or freshly generated value
   */
  public async getOrSet<T>(
    cacheName: string,
    key: string,
    fn: () => Promise<T>,
    ttlSeconds: number = 300 // 5 minutes default
  ): Promise<T> {
    const cacheMap = this.getOrCreateCache<T>(cacheName);
    const existing = cacheMap.get(key);
    
    // If item exists and is not expired, return it
    if (existing && existing.expiry > Date.now()) {
      return existing.value;
    }
    
    // Otherwise, execute the function, cache the result and return it
    const value = await fn();
    const expiry = Date.now() + (ttlSeconds * 1000);
    cacheMap.set(key, { value, expiry });
    
    return value;
  }
  
  /**
   * Invalidate a cached value
   * @param cacheName The name of the cache
   * @param key The cache key to invalidate
   */
  public invalidate(cacheName: string, key: string): void {
    const cache = this.caches.get(cacheName);
    if (cache) {
      cache.delete(key);
    }
  }
  
  /**
   * Clear an entire cache
   * @param cacheName The name of the cache to clear
   */
  public clearCache(cacheName: string): void {
    this.caches.delete(cacheName);
  }
  
  /**
   * Clear all caches
   */
  public clearAll(): void {
    this.caches.clear();
  }
  
  /**
   * Get or create a cache for a specific name
   * @param cacheName The name of the cache
   * @returns The cache map
   */
  private getOrCreateCache<T>(cacheName: string): CacheMap<T> {
    if (!this.caches.has(cacheName)) {
      this.caches.set(cacheName, new Map());
    }
    return this.caches.get(cacheName) as CacheMap<T>;
  }
} 