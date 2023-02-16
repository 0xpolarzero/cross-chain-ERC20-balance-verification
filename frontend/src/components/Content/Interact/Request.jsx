import { useRef, useState } from 'react';
import requestAuthorization, { requestConfig } from '@/systems';
import { Button } from 'antd';
import { toast } from 'react-toastify';

const requestedChains = requestConfig.getChainsNames().join(', ');

const Request = ({
  address,
  checkAuthorization,
  requiredBalance,
  isAuthorized,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const toastId = useRef(null);

  const updateToast = (message) => {
    // Keep it loading but update the message
    if (toastId.current)
      toast.update(toastId.current, {
        render: message,
        type: 'loading',
        isLoading: true,
        autoClose: false,
      });
  };

  const executeRequest = async () => {
    setIsRequesting(true);
    toastId.current = toast.loading('Requesting authorization...');

    try {
      const res = await requestAuthorization(address, updateToast);
      if (res.error) {
        toast.update(toastId.current, {
          render: 'Authorization request failed.',
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.update(toastId.current, {
          render: 'Authorization request successful.',
          type: 'success',
          isLoading: false,
          autoClose: 5000,
        });
        const balance = (
          <Rounded
            amount={res.result.toString()}
            decimals={requestConfig.config.tokenDecimals}
            symbol={requestConfig.config.tokenSymbol}
          />
        );
        const totalCost = (
          <Rounded
            amount={res.cost}
            decimals={null}
            symbol={requestConfig.config.tokenSymbol}
          />
        );

        toast.info(
          <>
            Balance found across all chains:{' '}
            <span className='emphasize'>{balance}</span>
            <br />
            Cost of the request: <span className='emphasize'>{totalCost}</span>
          </>,
        );
      }
    } catch (err) {
      console.log('error in frontend', err);
      toast.update(toastId.current, {
        render: 'Something went wrong. Please check the console.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsRequesting(false);
      toastId.current = null;
      checkAuthorization();
    }
  };

  return (
    <div className='action request'>
      <div className='justify'>
        <span className='step emphasize'>1</span>In order to pass the
        authorization, you need to hold at least a{' '}
        <b>
          combined balance of {requiredBalance}{' '}
          {requestConfig.config.tokenSymbol}
        </b>{' '}
        on the following chains: <b>{requestedChains}</b>.
      </div>
      <Button
        type='primary'
        onClick={executeRequest}
        // disabled={isAuthorized}
        loading={isRequesting}
      >
        Request authorization
      </Button>
    </div>
  );
};

const Rounded = ({ amount, decimals, symbol }) => {
  const formatted = decimals ? Number(amount) / 10 ** decimals : Number(amount);
  const rounded = Number(formatted.toFixed(4));

  return (
    <span className='emphasize'>
      {rounded} {symbol}
    </span>
  );
};

export default Request;
