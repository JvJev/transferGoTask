// pages/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { getCoinsData } from '../lib/dataUtils';
import { useFavorites } from '../lib/favoritesContext';
import CoinList from '../components/CoinList';

export default function Home({ initialCoins }) {
  const [coins, setCoins] = useState(initialCoins);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_rank');
  const { favorites } = useFavorites();

  useEffect(() => {
    let filteredCoins = initialCoins.filter(
      (coin) =>
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
          return (
            (b.price_change_percentage_24h || 0) -
            (a.price_change_percentage_24h || 0)
          );
        case 'change_24h-asc':
          return (
            (a.price_change_percentage_24h || 0) -
            (b.price_change_percentage_24h || 0)
          );
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
        <h1 className={styles.title}>Crypto Dashboard</h1>
        <p className={styles.description}>
          Find and analyze your favorite cryptocurrency.
        </p>

        <div className={styles.navigationButtons}>
          <Link href="/favorites" className={styles.favoritesButton}>
            ★ My Favorites
            {favorites.length > 0 && (
              <span className={styles.favoritesCount}>{favorites.length}</span>
            )}
          </Link>
        </div>

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
            <option value="market_cap_rank">Default (Market Cap)</option>
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

        <CoinList coins={coins} searchTerm={searchTerm} />
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const initialCoins = await getCoinsData();

  return {
    props: {
      initialCoins,
    },
    revalidate: 30,
  };
}
