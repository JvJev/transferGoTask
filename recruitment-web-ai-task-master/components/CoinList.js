// components/CoinList.js
import React from 'react';
import Link from 'next/link';
import {
  formatLargeNumber,
  formatPercentage,
  formatSupply,
} from '../lib/formatUtils';
import { useFavorites } from '../lib/favoritesContext';
import styles from './CoinList.module.css';

const CoinList = ({ coins, searchTerm, showOnlyFavorites = false }) => {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

  // Filter coins if showing only favorites
  const displayCoins = showOnlyFavorites
    ? coins.filter((coin) => isFavorite(coin.id))
    : coins;

  const handleFavoriteClick = (e, coinId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(coinId);
  };

  if (!isLoaded) {
    return (
      <div className={styles.container}>
        <div className={styles.noResults}>Loading favorites...</div>
      </div>
    );
  }

  if (displayCoins.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noResults}>
          {showOnlyFavorites
            ? 'No favorite coins yet. Star some coins from the main dashboard!'
            : searchTerm
            ? `No coins found matching "${searchTerm}"`
            : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Desktop Grid View */}
      <div className={styles.desktopGrid}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerRank}>#</div>
          <div className={styles.headerItem}>Name</div>
          <div className={styles.headerRight}>Price</div>
          <div className={styles.headerRight}>24h %</div>
          <div className={styles.headerRight}>Market Cap</div>
          <div className={styles.headerRight}>Volume (24h)</div>
          <div className={styles.headerRight}>Circulating Supply</div>
          <div className={styles.headerFavorite}>★</div>
        </div>

        {/* Coins */}
        {displayCoins.map((coin) => (
          <div key={coin.id} className={styles.coinRow}>
            <Link href={`/coins/${coin.id}`} className={styles.coinRowInner}>
              <div className={styles.rankCell}>{coin.market_cap_rank}</div>

              <div className={styles.nameCell}>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className={styles.coinIcon}
                />
                <div className={styles.coinInfo}>
                  <span className={styles.coinName}>{coin.name}</span>
                  <span className={styles.coinSymbol}>
                    {coin.symbol.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className={styles.priceCell}>
                ${coin.current_price.toLocaleString()}
              </div>

              <div
                className={`${styles.changeCell} ${
                  coin.price_change_percentage_24h >= 0
                    ? styles.positive
                    : styles.negative
                }`}
              >
                {formatPercentage(coin.price_change_percentage_24h)}
              </div>

              <div className={styles.marketCapCell}>
                {formatLargeNumber(coin.market_cap)}
              </div>

              <div className={styles.volumeCell}>
                {formatLargeNumber(coin.total_volume)}
              </div>

              <div className={styles.supplyCell}>
                {formatSupply(coin.circulating_supply)}{' '}
                {coin.symbol.toUpperCase()}
              </div>

              <div className={styles.favoriteCell}>
                <button
                  className={`${styles.favoriteButton} ${
                    isFavorite(coin.id) ? styles.favoriteActive : ''
                  }`}
                  onClick={(e) => handleFavoriteClick(e, coin.id)}
                  aria-label={
                    isFavorite(coin.id)
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  }
                >
                  ★
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileCards}>
        {displayCoins.map((coin) => (
          <div key={coin.id} className={styles.mobileCardWrapper}>
            <Link href={`/coins/${coin.id}`} className={styles.mobileCardLink}>
              <div className={styles.mobileCard}>
                <div className={styles.mobileCardHeader}>
                  <span className={styles.rankBadge}>
                    #{coin.market_cap_rank}
                  </span>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className={styles.coinIcon}
                  />
                  <div className={styles.coinInfo}>
                    <span className={styles.coinName}>{coin.name}</span>
                    <span className={styles.coinSymbol}>
                      {coin.symbol.toUpperCase()}
                    </span>
                  </div>
                  <button
                    className={`${styles.mobileFavoriteButton} ${
                      isFavorite(coin.id) ? styles.favoriteActive : ''
                    }`}
                    onClick={(e) => handleFavoriteClick(e, coin.id)}
                    aria-label={
                      isFavorite(coin.id)
                        ? 'Remove from favorites'
                        : 'Add to favorites'
                    }
                  >
                    ★
                  </button>
                </div>

                <div className={styles.mobileCardGrid}>
                  <div className={styles.mobileMetric}>
                    <span className={styles.mobileMetricLabel}>Price</span>
                    <span className={styles.mobileMetricValuePrice}>
                      ${coin.current_price.toLocaleString()}
                    </span>
                  </div>

                  <div className={styles.mobileMetric}>
                    <span className={styles.mobileMetricLabel}>24h Change</span>
                    <span
                      className={`${styles.mobileMetricValue} ${
                        coin.price_change_percentage_24h >= 0
                          ? styles.positive
                          : styles.negative
                      }`}
                    >
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </span>
                  </div>

                  <div className={styles.mobileMetric}>
                    <span className={styles.mobileMetricLabel}>Market Cap</span>
                    <span className={styles.mobileMetricValue}>
                      {formatLargeNumber(coin.market_cap)}
                    </span>
                  </div>

                  <div className={styles.mobileMetric}>
                    <span className={styles.mobileMetricLabel}>Volume</span>
                    <span className={styles.mobileMetricValue}>
                      {formatLargeNumber(coin.total_volume)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinList;
