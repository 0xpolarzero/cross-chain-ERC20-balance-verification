import { useEffect, useState } from 'react';
import { Divider } from 'antd';
import { useAccount } from 'wagmi';
import requestAuthorization from '@/systems';

const Content = () => {
  return (
    <main>
      <Overview />
      <Instructions />
      <Interact />
    </main>
  );
};

const Overview = () => {
  return (
    <div className='overview'>
      <div className='title'>
        <Divider orientation='left' style={{ margin: 0 }}>
          Overview
        </Divider>
      </div>
      <div className='content'>
        <p>
          This app allows users to access a{' '}
          <b>cross-chain ERC20 token-gated smart contract</b>, from a specific
          chain (Polygon Mumbai).
        </p>
        <p>
          If they hold a sufficient combined balance accross multiple chains,
          they can{' '}
          <b>request authorization to run specific functions on the contract</b>
          .
        </p>
      </div>
    </div>
  );
};

const Instructions = () => {
  return (
    <div className='instructions'>
      <div className='title'>
        <Divider orientation='left' style={{ margin: 0 }}>
          Instructions
        </Divider>
      </div>
      <div className='content'>
        <p>
          Follow the instructions below to test the app with your own wallet.
        </p>

        <ol>
          <li>
            <b>Connect your wallet</b> to the app and select the Polygon Mumbai
            testnet.
          </li>
          <li>
            {' '}
            Click the <span className='emphasize'>
              Request authorization
            </span>{' '}
            button to run the request and <b>get authorized</b> in the contract.
          </li>
          <li>
            If you were successfully verified, <b>enter a new number</b> and run
            the <span className='emphasize'>Update number</span> function, which
            is <b>restricted to authorized addresses</b>.
          </li>
        </ol>
      </div>
    </div>
  );
};

const Interact = () => {
  const { address } = useAccount();

  // We need to use this trick because conditional rendering with raw wagmi hooks
  // causes hydratation errors
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(!!address);
  }, [address]);

  return (
    <div className='interact'>
      <div className='title'>
        <Divider orientation='left' style={{ margin: 0 }}>
          Interact
        </Divider>
      </div>
      <div className='content'>
        {isConnected ? (
          <div className='interact-actions'>
            <Request address={address} />
            <Update />
          </div>
        ) : (
          <div className='emphasize'>
            Please connect your wallet to use the app
          </div>
        )}
      </div>
    </div>
  );
};

const Request = ({ address }) => {
  const executeRequest = async () => {
    const res = await requestAuthorization(address);
    console.log('received a response in frontend', res);
  };

  return (
    <div className='request'>
      <button className='button-primary' onClick={executeRequest}>
        Request authorization
      </button>
    </div>
  );
};

const Update = () => {
  return <div className='update'>bb</div>;
};
export default Content;
