import coinCache from '../../lib/coinCache';

export default function handler(req, res) {
  const formatBytes = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';
  
  // Get cache statistics from coinCache
  const cacheStats = coinCache.getStats();
  
  // Get memory usage
  const memoryUsage = process.memoryUsage();
  
  // Calculate cache size in memory
  let cacheSize = 0;
  if (global.sharedCoinCache) {
    cacheSize = JSON.stringify(global.sharedCoinCache).length;
  }
  
  res.status(200).json({
    cache: {
      ...cacheStats,
      approximateSize: formatBytes(cacheSize),
      cacheDurationMs: 60000, // 60 seconds
    },
    memory: {
      rss: formatBytes(memoryUsage.rss),
      heapTotal: formatBytes(memoryUsage.heapTotal),
      heapUsed: formatBytes(memoryUsage.heapUsed),
      external: formatBytes(memoryUsage.external),
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: `${Math.floor(process.uptime())} seconds`
    }
  });
}