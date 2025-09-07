// pages/_app.js
import Layout from '../layouts/Layout';
import { FavoritesProvider } from '../lib/favoritesContext';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <FavoritesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FavoritesProvider>
  );
}
