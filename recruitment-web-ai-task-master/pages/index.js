import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { getCoinsData } from '../lib/dataUtils';
import { formatLargeNumber, formatPercentage, formatSupply } from '../lib/formatUtils';

export default function Home({ initialCoins }) {
  const [coins, setCoins] = useState(initialCoins);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_rank');

  useEffect(() => {
    let filteredCoins = initialCoins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply sorting
    filteredCoins = [...filteredCoins].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.current_price - b.current_price;
        case 'price-desc':
          return b.current_price - a.current_price;
        case 'market_cap-desc':
          return b.market_cap - a.market_cap;
        case 'market_cap-asc':
          return a.market_cap - b.market_cap;
        case 'change_24h-desc':
          return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0);
        case 'change_24h-asc':
          return (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0);
        case 'volume-desc':
          return b.total_volume - a.total_volume;
        case 'volume-asc':
          return a.total_volume - b.total_volume;
        case 'market_cap_rank':
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });

    setCoins(filteredCoins);
  }, [searchTerm, sortBy, initialCoins]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Crypto Dashboard
        </h1>
        <p className={styles.description}>
          Find and analyze your favorite cryptocurrency.
        </p>

        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search (e.g., Bitcoin)..."
            className={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="market_cap_rank">Rank (Default)</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-desc">Price High to Low</option>
            <option value="price-asc">Price Low to High</option>
            <option value="market_cap-desc">Market Cap High to Low</option>
            <option value="market_cap-asc">Market Cap Low to High</option>
            <option value="change_24h-desc">24h Change High to Low</option>
            <option value="change_24h-asc">24h Change Low to High</option>
            <option value="volume-desc">Volume High to Low</option>
            <option value="volume-asc">Volume Low to High</option>
          </select>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.cryptoTable}>
            <thead>
              <tr>
                <th className={styles.rankColumn}>#</th>
                <th className={styles.nameColumn}>Name</th>
                <th className={styles.priceColumn}>Price</th>
                <th className={styles.changeColumn}>24h %</th>
                <th className={styles.marketCapColumn}>Market Cap</th>
                <th className={styles.volumeColumn}>Volume (24h)</th>
                <th className={styles.supplyColumn}>Circulating Supply</th>
              </tr>
            </thead>
            <tbody>
              {coins.length > 0 ? (
                coins.map(coin => (
                  <tr key={coin.id} className={styles.tableRow}>
                    <td className={styles.rankCell}>{coin.market_cap_rank}</td>
                    <td className={styles.nameCell}>
                      <Link href={`/coins/${coin.id}`} legacyBehavior>
                        <a className={styles.coinLink}>
                          <img src={coin.image} alt={coin.name} className={styles.coinIcon} />
                          <div className={styles.coinNameInfo}>
                            <span className={styles.coinName}>{coin.name}</span>
                            <span className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</span>
                          </div>
                        </a>
                      </Link>
                    </td>
                    <td className={styles.priceCell}>
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className={`${styles.changeCell} ${coin.price_change_percentage_24h >= 0 ? styles.positive : styles.negative}`}>
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </td>
                    <td className={styles.marketCapCell}>
                      {formatLargeNumber(coin.market_cap)}
                    </td>
                    <td className={styles.volumeCell}>
                      {formatLargeNumber(coin.total_volume)}
                    </td>
                    <td className={styles.supplyCell}>
                      {formatSupply(coin.circulating_supply)} {coin.symbol.toUpperCase()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.noResults}>
                    {searchTerm ? `No coins found matching "${searchTerm}"` : 'No cryptocurrency data available. Make sure that command "node updateCoins.js" is running in second terminal.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const initialCoins = getCoinsData();
  
  return {
    props: {
      initialCoins,
    },
    revalidate: 30,
  };
}