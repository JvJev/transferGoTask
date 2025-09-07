// components/LoadingDots.js
import styles from './LoadingDots.module.css';

export default function LoadingDots({ message = "Loading cryptocurrency data..." }) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.dotsContainer}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
