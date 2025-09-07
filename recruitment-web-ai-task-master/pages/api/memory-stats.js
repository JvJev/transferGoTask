export default function handler(req, res) {
  const used = process.memoryUsage();
  res.json({
    rss: `${Math.round(used.rss / 1024 / 1024)} MB`, // Total memory
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    coinCacheSize: global.sharedCoinCache ? 
      `~${JSON.stringify(global.sharedCoinCache).length / 1024 / 1024} MB` : 
      '0 MB'
  });
}