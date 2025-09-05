import Link from 'next/link';
import styles from '../../styles/Coin.module.css';

function CoinPage({ coin }) {

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          {coin.image?.large ? (
            <img src={coin.image.large} alt={coin.name} className={styles.coinImage} />
          ) : null}
          <h1 className={styles.title}>{coin.name} ({coin.symbol.toUpperCase()})</h1>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailBox}>
            <h3>Current Price</h3>
            <p className={styles.priceValue}>${coin.market_data.current_price.usd}</p>
          </div>
          <div className={styles.detailBox}>
            <h3>24h Change</h3>
            <p className={coin.market_data.price_change_percentage_24h > 0 ? styles.positive : styles.negative}>
              {coin.market_data.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
          <div className={styles.detailBox}>
            <h3>Market Cap</h3>
            <p>${coin.market_data.market_cap.usd}</p>
          </div>
        </div>

        <div className={styles.description}>
          <h3>About {coin.name}</h3>
          {/* We use dangerouslySetInnerHTML because the API returns HTML */}
          <p dangerouslySetInnerHTML={{ __html: coin.description.en.split('. ')[0] + '.' }}></p>
        </div>

        <Link href="/" legacyBehavior>
          <a className={styles.backButton}>&larr; Back to list</a>
        </Link>
      </main>
    </div>
  );
}

export default CoinPage;

export async function getStaticProps(context) {
      const { id } = context.params;
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
      if (!res.ok) {
          throw new Error(`Failed to fetch coin data: ${res.status}`);
      }
      const coin = await res.json();

      return {
          props: {
          coin,
          },
          revalidate: 60,
      };
}

export async function getStaticPaths() {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      if (!res.ok) {
          throw new Error(`Failed to fetch paths: ${res.status}`);
      }
      const coins = await res.json();
      const paths = coins.map(coin => ({
          params: { id: coin.id },
      }));

      return {
          paths,
          fallback: 'blocking',
      };
}