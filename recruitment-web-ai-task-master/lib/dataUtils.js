const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(process.cwd(), 'cache');
const COINS_FILE = path.join(CACHE_DIR, 'coinsApiData.json');

function getCoinsData() {
  try {
    if (!fs.existsSync(COINS_FILE)) {
      console.warn('Coins data file not found. Make sure updateCoins.js is running.');
      return [];
    }

    const fileContent = fs.readFileSync(COINS_FILE, 'utf8');
    const parsedData = JSON.parse(fileContent);
    
    return parsedData.data || [];
  } catch (error) {
    console.error('Error reading coins data:', error.message);
    return [];
  }
}

function getCoinData(coinId) {
  try {
    const allCoins = getCoinsData();
    const coin = allCoins.find(c => c.id === coinId);
    
    if (!coin) {
      return null;
    }

    // Transform the data to match what the component expects
    return {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: {
        large: coin.image
      },
      market_data: {
        current_price: {
          usd: coin.current_price
        },
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap: {
          usd: coin.market_cap
        }
      },
      description: {
        en: `${coin.name} is currently ranked #${coin.market_cap_rank} by market capitalization.`
      }
    };
  } catch (error) {
    console.error(`Error reading coin data for ${coinId}:`, error.message);
    return null;
  }
}

module.exports = {
  getCoinsData,
  getCoinData
};