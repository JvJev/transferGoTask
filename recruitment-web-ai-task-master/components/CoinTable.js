// components/CoinTable.js
import CoinRow from './CoinRow';
import LoadingDots from './LoadingDots';
import styles from '../styles/Home.module.css';

export default function CoinTable({ coins, searchTerm }) {
  return (
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
              <CoinRow key={coin.id} coin={coin} />
            ))
          ) : (
            <tr>
              <td colSpan="7" className={styles.noResults}>
                {searchTerm ? (
                  `No coins found matching "${searchTerm}"`
                ) : (
                  <LoadingDots />
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}