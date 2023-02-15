import { WagmiConfig, createClient } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';

const client = createClient(
  getDefaultClient({
    appName: 'Your App Name',
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    chains: [polygonMumbai],
  }),
);

const Config = ({ children }) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider
        mode='light'
        customTheme={{
          '--ck-font-family': 'var(--font-main)',
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Config;
