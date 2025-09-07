// pages/coins/[id].js (with back button at top and bottom)
import Link from 'next/link';
import styles from '../../styles/Coin.module.css';
import LoadingDots from '../../components/LoadingDots';
import { getCoinData, getCoinsData } from '../../lib/dataUtils';
import { formatCurrency, formatLargeNumber, formatPercentageSimple, formatSupply } from '../../lib/formatUtils';


function CoinPage({ coin }) {
  if (!coin) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.loadingSection}>
            <LoadingDots message="Loading coin data..." />
            <Link href="/" legacyBehavior>
              <a className={styles.backButton}>&larr; Back to Dashboard</a>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isPositive = coin.price_change_percentage_24h >= 0;

  // Format date helper
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Back Button at Top */}
        <Link href="/" legacyBehavior>
          <a className={styles.backButton}>&larr; Back to Dashboard</a>
        </Link>

        {/* Header Section */}
        <div className={styles.header}>
          {coin.image && (
            <img src={coin.image} alt={coin.name} className={styles.coinImage} />
          )}
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>{coin.name} ({coin.symbol?.toUpperCase()})</h1>
            {coin.market_cap_rank && (
              <div className={styles.rank}>Rank #{coin.market_cap_rank}</div>
            )}
          </div>
        </div>

        {/* Price Display */}
        <div className={styles.priceSection}>
          <div className={styles.priceValue}>
            {formatCurrency(coin.current_price)}
          </div>
          <div className={`${styles.priceChange} ${isPositive ? styles.positive : styles.negative}`}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{formatCurrency(Math.abs(coin.price_change_24h || 0))}</span>
            <span>({formatPercentageSimple(coin.price_change_percentage_24h)})</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className={styles.detailsGrid}>
          <div className={styles.detailBox}>
            <h3>Market Cap</h3>
            <p>{formatLargeNumber(coin.market_cap)}</p>
            {coin.market_cap_change_percentage_24h && (
              <span className={`${styles.subMetric} ${coin.market_cap_change_percentage_24h >= 0 ? styles.positive : styles.negative}`}>
                {coin.market_cap_change_percentage_24h >= 0 ? '+' : ''}{coin.market_cap_change_percentage_24h.toFixed(2)}% (24h)
              </span>
            )}
          </div>

          <div className={styles.detailBox}>
            <h3>24h Volume</h3>
            <p>{formatLargeNumber(coin.total_volume || 0)}</p>
            {coin.total_volume && coin.market_cap && (
              <span className={styles.subMetric}>
                Vol/MCap: {((coin.total_volume / coin.market_cap) * 100).toFixed(2)}%
              </span>
            )}
          </div>

          <div className={styles.detailBox}>
            <h3>Circulating Supply</h3>
            <p>{formatSupply(coin.circulating_supply)} {coin.symbol?.toUpperCase()}</p>
          </div>

          <div className={styles.detailBox}>
            <h3>Fully Diluted Valuation</h3>
            <p>{formatLargeNumber(coin.fully_diluted_valuation || 0)}</p>
          </div>
        </div>

        {/* 24h Range */}
        <div className={styles.rangeSection}>
          <h3>24h Price Range</h3>
          <div className={styles.rangeDisplay}>
            <span className={styles.rangeLow}>Low: {formatCurrency(coin.low_24h || 0)}</span>
            <div className={styles.rangeBar}>
              {coin.high_24h && coin.low_24h && coin.current_price && (
                <div 
                  className={styles.rangeIndicator}
                  style={{
                    left: `${((coin.current_price - coin.low_24h) / (coin.high_24h - coin.low_24h)) * 100}%`
                  }}
                />
              )}
            </div>
            <span className={styles.rangeHigh}>High: {formatCurrency(coin.high_24h || 0)}</span>
          </div>
        </div>

        {/* All-Time Records */}
        {(coin.ath || coin.atl) && (
          <div className={styles.recordsSection}>
            <h3>All-Time Records</h3>
            <div className={styles.detailsGrid}>
              {coin.ath && (
                <div className={styles.detailBox}>
                  <h3>All-Time High</h3>
                  <p>{formatCurrency(coin.ath)}</p>
                  {coin.ath_change_percentage && (
                    <span className={`${styles.subMetric} ${styles.negative}`}>
                      {coin.ath_change_percentage.toFixed(2)}% from ATH
                    </span>
                  )}
                  {coin.ath_date && (
                    <span className={styles.dateInfo}>
                      {formatTimeAgo(coin.ath_date)}
                    </span>
                  )}
                </div>
              )}

              {coin.atl && (
                <div className={styles.detailBox}>
                  <h3>All-Time Low</h3>
                  <p>{formatCurrency(coin.atl)}</p>
                  {coin.atl_change_percentage && (
                    <span className={`${styles.subMetric} ${styles.positive}`}>
                      +{coin.atl_change_percentage.toFixed(0)}% from ATL
                    </span>
                  )}
                  {coin.atl_date && (
                    <span className={styles.dateInfo}>
                      {formatTimeAgo(coin.atl_date)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Supply Information */}
        {(coin.total_supply || coin.max_supply) && (
          <div className={styles.supplySection}>
            <h3>Supply Information</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailBox}>
                <h3>Circulating Supply</h3>
                <p>{formatSupply(coin.circulating_supply)} {coin.symbol?.toUpperCase()}</p>
              </div>
              
              {coin.total_supply && (
                <div className={styles.detailBox}>
                  <h3>Total Supply</h3>
                  <p>{formatSupply(coin.total_supply)} {coin.symbol?.toUpperCase()}</p>
                </div>
              )}
              
              {coin.max_supply && (
                <div className={styles.detailBox}>
                  <h3>Max Supply</h3>
                  <p>{formatSupply(coin.max_supply)} {coin.symbol?.toUpperCase()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ROI Information */}
        {coin.roi && (
          <div className={styles.roiSection}>
            <h3>Return on Investment</h3>
            <div className={styles.detailBox}>
              <h3>ROI ({coin.roi.currency?.toUpperCase()})</h3>
              <p className={styles.positive}>
                {coin.roi.times?.toFixed(2)}x ({coin.roi.percentage?.toFixed(2)}%)
              </p>
            </div>
          </div>
        )}

        {/* Description */}
        <div className={styles.description}>
          <h3>About {coin.name}</h3>
          <p>
            {coin.name} ({coin.symbol?.toUpperCase()}) is currently ranked #{coin.market_cap_rank} by market capitalization
            with a market cap of {formatLargeNumber(coin.market_cap)}.
            {coin.circulating_supply && coin.max_supply && (
              ` There are ${formatSupply(coin.circulating_supply)} ${coin.symbol?.toUpperCase()} tokens currently in circulation 
              out of a maximum supply of ${formatSupply(coin.max_supply)} tokens.`
            )}
            {coin.price_change_percentage_24h && (
              ` The price has ${coin.price_change_percentage_24h >= 0 ? 'increased' : 'decreased'} by 
              ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}% in the last 24 hours.`
            )}
          </p>
          
          {coin.last_updated && (
            <p className={styles.lastUpdated}>
              <em>Data last updated: {new Date(coin.last_updated).toLocaleString()}</em>
            </p>
          )}
        </div>

        {/* Back Button at Bottom */}
        <Link href="/" legacyBehavior>
          <a className={styles.backButton}>&larr; Back to Dashboard</a>
        </Link>
      </main>
    </div>
  );
}

export default CoinPage;

export async function getStaticProps(context) {
  const { id } = context.params;
  
  try {
    const coin = await getCoinData(id);

    if (!coin) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        coin,
      },
      revalidate: 30,
    };
  } catch (error) {
    console.error(`Error loading coin ${id}:`, error);
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    const coins = await getCoinsData();
    
    const paths = coins.map(coin => ({
      params: { id: coin.id },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}