export default function handler(req, res) {
  const formatBytes = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';
  
  // Get actual size of cached data
  let cacheSize = 0;
  if (global.sharedCoinCache) {
    // This gives rough size in memory
    cacheSize = JSON.stringify(global.sharedCoinCache).length;
  }
  
  const memoryUsage = process.memoryUsage();
  
  res.json({
    nodeMemory: {
      total: formatBytes(memoryUsage.rss),
      heap: formatBytes(memoryUsage.heapUsed)
    },
    cacheInfo: {
      hasCache: !!global.sharedCoinCache,
      coinCount: global.sharedCoinCache?.length || 0,
      approximateSize: formatBytes(cacheSize),
      explanation: "This is the actual 100 coins memory size"
    }
  });
}