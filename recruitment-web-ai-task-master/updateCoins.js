const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, 'cache');
const COINS_FILE = path.join(CACHE_DIR, 'coinsApiData.json');
const UPDATE_INTERVAL = 60 * 1000; // 60 seconds

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  console.log('Created cache directory');
}

async function fetchCoinsData() {
  try {
    console.log('Fetching coins data from CoinGecko...');
    
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const coinsData = await response.json();
    
    // Create data object with metadata
    const dataToSave = {
      lastUpdated: new Date().toISOString(),
      coinsCount: coinsData.length,
      data: coinsData
    };

    // Save to file
    fs.writeFileSync(COINS_FILE, JSON.stringify(dataToSave, null, 2));
    
    console.log(`✅ Successfully updated ${coinsData.length} coins at ${new Date().toLocaleTimeString()}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error fetching coins data:', error.message);
    return false;
  }
}

async function runUpdate() {
  console.log('\n🔄 Starting update cycle...');
  await fetchCoinsData();
}

// Initial run
console.log('🚀 Starting CoinGecko data updater...');
console.log(`📁 Cache directory: ${CACHE_DIR}`);
console.log(`⏰ Update interval: ${UPDATE_INTERVAL / 1000} seconds`);

runUpdate();

// Set up interval for subsequent runs
setInterval(runUpdate, UPDATE_INTERVAL);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});