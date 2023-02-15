import Config from '@/components/Config';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <Config>
      <Component {...pageProps} />
    </Config>
  );
}
