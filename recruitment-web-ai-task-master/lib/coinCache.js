// lib/coinCache.js
const fs = require('fs');
const path = require('path');

class CoinCache {
  constructor() {
    this.CACHE_FILE = path.join(process.cwd(), '.cache-timestamp');
    this.cache = null;
    this.fetchPromise = null;
    this.CACHE_DURATION = 60 * 1000; // 60 seconds
    this.API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
  }

  getLastFetchTime() {
    try {
      if (fs.existsSync(this.CACHE_FILE)) {
        const timestamp = fs.readFileSync(this.CACHE_FILE, 'utf8');
        return parseInt(timestamp, 10) || 0;
      }
    } catch (error) {
      console.error('Error reading cache timestamp:', error);
    }
    return 0;
  }

  setLastFetchTime(time) {
    try {
      fs.writeFileSync(this.CACHE_FILE, time.toString());
    } catch (error) {
      console.error('Error writing cache timestamp:', error);
    }
  }

  async getCoins() {
    const now = Date.now();
    const lastFetch = this.getLastFetchTime();
    const cacheAge = now - lastFetch;
    
    // If we have in-memory cache AND the global cache is fresh, use it
    if (this.cache && cacheAge < this.CACHE_DURATION) {
      return this.cache;
    }

    // If global cache is fresh but we don't have it in memory, check if another instance has it
    if (cacheAge < this.CACHE_DURATION && global.sharedCoinCache) {
      this.cache = global.sharedCoinCache;
      return this.cache;
    }

    // If already fetching, wait for that request
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    // Check global fetch promise to prevent multiple instances from fetching
    if (global.fetchPromise) {
      const result = await global.fetchPromise;
      this.cache = result;
      return result;
    }

    // Only fetch if cache is truly stale
    if (cacheAge >= this.CACHE_DURATION) {
      this.fetchPromise = this.fetchFreshData();
      global.fetchPromise = this.fetchPromise;
      
      try {
        const data = await this.fetchPromise;
        return data;
      } finally {
        this.fetchPromise = null;
        global.fetchPromise = null;
      }
    }

    // Return existing cache or empty array
    return this.cache || global.sharedCoinCache || [];
  }

  async fetchFreshData() {
    try {
      console.log('Fetching coins data from CoinGecko...');
      
      const response = await fetch(this.API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const coinsData = await response.json();
      
      // Update cache in memory and globally
      this.cache = coinsData;
      global.sharedCoinCache = coinsData;
      
      // Update the timestamp file
      this.setLastFetchTime(Date.now());
      
      console.log(`✅ Successfully cached ${coinsData.length} coins at ${new Date().toLocaleTimeString()}`);
      
      return coinsData;
      
    } catch (error) {
      console.error('❌ Error fetching coins data:', error.message);
      
      // Return existing cache if available
      if (this.cache || global.sharedCoinCache) {
        console.log('Returning existing cache due to error');
        return this.cache || global.sharedCoinCache;
      }
      
      return [];
    }
  }

  async getCoinById(coinId) {
    const coins = await this.getCoins();
    return coins.find(coin => coin.id === coinId);
  }

  // Force refresh (for manual update if needed)
  async refresh() {
    this.setLastFetchTime(0); // Mark cache as stale
    return this.getCoins();
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    const lastFetch = this.getLastFetchTime();
    const age = now - lastFetch;
    const isStale = age > this.CACHE_DURATION;
    
    return {
      hasCachedData: this.cache !== null || global.sharedCoinCache !== null,
      coinCount: (this.cache || global.sharedCoinCache)?.length || 0,
      cacheAgeSeconds: Math.floor(age / 1000),
      isStale,
      nextRefreshInSeconds: isStale ? 0 : Math.floor((this.CACHE_DURATION - age) / 1000)
    };
  }
}

// Create singleton instance
const coinCache = new CoinCache();
module.exports = coinCache;