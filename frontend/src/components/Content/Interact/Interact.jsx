import { useEffect, useState } from 'react';
import { Divider } from 'antd';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';
import Request from './Request';
import Update from './Update';
import { requestConfig } from '@/systems';

const Interact = () => {
  const { address } = useAccount();

  // We need to use this trick because conditional rendering with raw wagmi hooks
  // causes hydratation errors
  const [isConnected, setIsConnected] = useState(false);
  const [requiredBalance, setRequiredBalance] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const getRequiredBalance = async () => {
    const data = await readContract({
      address: requestConfig.config.contractAddress,
      abi: requestConfig.abi.functionsConsumerAbi,
      functionName: 'getRequiredBalance',
    });

    setRequiredBalance(
      Number(data.toString()) / 10 ** requestConfig.config.tokenDecimals,
    );
  };

  const checkAuthorization = async () => {
    const data = await readContract({
      address: requestConfig.config.contractAddress,
      abi: requestConfig.abi.functionsConsumerAbi,
      functionName: 'getAuthorizationStatus',
      args: [address],
    });

    setIsAuthorized(data);
  };

  useEffect(() => {
    getRequiredBalance();
  }, []);

  useEffect(() => {
    setIsConnected(!!address);
    if (isConnected) checkAuthorization();
  }, [address]);

  return (
    <div className='interact'>
      <div className='title'>
        <Divider orientation='left' style={{ margin: 0 }}>
          Try it
        </Divider>
      </div>
      <div className='content'>
        {isConnected ? (
          <div className='interact-actions'>
            <Request
              address={address}
              checkAuthorization={checkAuthorization}
              requiredBalance={requiredBalance}
              isAuthorized={isAuthorized}
            />
            <Update
              requiredBalance={requiredBalance}
              isAuthorized={isAuthorized}
            />
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

export default Interact;
