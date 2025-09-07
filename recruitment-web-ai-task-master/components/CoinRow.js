// components/CoinRow.js
import Link from 'next/link';
import { formatLargeNumber, formatPercentage, formatSupply } from '../lib/formatUtils';
import styles from '../styles/Home.module.css';

export default function CoinRow({ coin }) {
  return (
    <tr className={styles.tableRow}>
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
  );
}
