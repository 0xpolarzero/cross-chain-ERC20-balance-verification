import { WagmiConfig, createClient } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { ToastContainer } from 'react-toastify';
import { ConfigProvider } from 'antd';

const client = createClient(
  getDefaultClient({
    appName: 'Your App Name',
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    chains: [polygonMumbai],
  }),
);

const Config = ({ children }) => {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#646cff',
          },
        }}
      >
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
      </ConfigProvider>
      <ToastContainer position='bottom-right' autoClose={5000} newestOnTop />
    </>
  );
};

export default Config;
