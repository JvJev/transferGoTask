import Link from 'next/link';
import styles from '../../styles/Coin.module.css';
import { getCoinData, getCoinsData } from '../../lib/dataUtils';
import { formatCurrency, formatLargeNumber, formatPercentageSimple } from '../../lib/formatUtils';

function CoinPage({ coin }) {
  if (!coin || !coin.market_data) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Coin not found</h1>
          <p>The requested cryptocurrency could not be loaded. Launch "node updateCoins.js" command in other terminal from root directory.</p>
          <Link href="/" legacyBehavior>
            <a className={styles.backButton}>&larr; Back to list</a>
          </Link>
        </main>
      </div>
    );
  }

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
            <p className={styles.priceValue}>
              {formatCurrency(coin.market_data?.current_price?.usd)}
            </p>
          </div>
          <div className={styles.detailBox}>
            <h3>24h Change</h3>
            <p className={coin.market_data?.price_change_percentage_24h > 0 ? styles.positive : styles.negative}>
              {formatPercentageSimple(coin.market_data?.price_change_percentage_24h)}
            </p>
          </div>
          <div className={styles.detailBox}>
            <h3>Market Cap</h3>
            <p>{formatLargeNumber(coin.market_data?.market_cap?.usd)}</p>
          </div>
        </div>

        <div className={styles.description}>
          <h3>About {coin.name}</h3>
          <p>{coin.description.en}</p>
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
  const coin = getCoinData(id);

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
}

export async function getStaticPaths() {
  const coins = getCoinsData();
  
  const paths = coins.map(coin => ({
    params: { id: coin.id },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}