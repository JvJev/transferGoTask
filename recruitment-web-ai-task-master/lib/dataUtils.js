// lib/dataUtils.js (fixed - no data transformation)
const coinCache = require('./coinCache');

async function getCoinsData() {
  try {
    const coins = await coinCache.getCoins();
    return coins;
  } catch (error) {
    console.error('Error getting coins data:', error.message);
    return [];
  }
}

async function getCoinData(coinId) {
  try {
    const coin = await coinCache.getCoinById(coinId);
    
    if (!coin) {
      return null;
    }

    // Return the full coin data directly from the API
    // No transformation needed - the API gives us everything we need
    return coin;
  } catch (error) {
    console.error(`Error reading coin data for ${coinId}:`, error.message);
    return null;
  }
}

module.exports = {
  getCoinsData,
  getCoinData
};