import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home({ initialCoins }) {

  const [coins, setCoins] = useState(initialCoins);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filteredCoins = initialCoins.filter(coin =>
        coin.name.includes(searchTerm) || coin.symbol.includes(searchTerm)
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
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.grid}>
          {coins.map(coin => (
            <Link href={`/coins/${coin.id}`} key={coin.id} legacyBehavior>
              <a className={styles.card}>
                <img src={coin.image} alt={coin.name} width={50} height={50} />
                <h2>{coin.name}</h2>
                <p>{coin.symbol.toUpperCase()}</p>
                <p className={styles.price}>${coin.current_price.toLocaleString()}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {

    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
    
    if (!res.ok) {
      // If the response is not successful, throw an error
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const initialCoins = await res.json();

    return {
      props: {
        initialCoins,
      },
      revalidate: 60, // Refresh data every 60 seconds
    };
}