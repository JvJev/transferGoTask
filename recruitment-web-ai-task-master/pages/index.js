import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { getCoinsData } from '../lib/dataUtils';

export default function Home({ initialCoins }) {
  const [coins, setCoins] = useState(initialCoins);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filteredCoins = initialCoins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCoins(filteredCoins);
  }, [searchTerm, initialCoins]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Crypto Dashboard
        </h1>
        <p className={styles.description}>
          Find and analyze your favorite cryptocurrency.
        </p>

        <input
          type="text"
          placeholder="Search (e.g., Bitcoin)..."
          className={styles.searchBar}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.grid}>
          {coins.length > 0 ? (
            coins.map(coin => (
              <Link href={`/coins/${coin.id}`} key={coin.id} legacyBehavior>
                <a className={styles.card}>
                  <img src={coin.image} alt={coin.name} width={50} height={50} />
                  <h2>{coin.name}</h2>
                  <p>{coin.symbol.toUpperCase()}</p>
                  <p className={styles.price}>${coin.current_price.toLocaleString()}</p>
                </a>
              </Link>
            ))
          ) : (
            <div className={styles.noResults}>
              {searchTerm ? `No coins found matching "${searchTerm}"` : 'No cryptocurrency data available. Make sure that command "node updateCoins.js" is running in second terminal.'}
            </div>
          )}
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
    revalidate: 30, // Revalidate every 30 seconds to pick up file changes
  };
}