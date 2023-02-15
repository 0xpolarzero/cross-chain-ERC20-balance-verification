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

  const executeRequest = async () => {
    setIsRequesting(true);
    toastId.current = toast.loading('Requesting authorization...');

    try {
      const res = await requestAuthorization(address, toastId.current);
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

        const balance =
          Number(res.result.toString()) /
            10 ** requestConfig.config.tokenDecimals || 0;
        const totalCost = res.cost || 0;

        toast.info(
          <>
            Balance found across all chains:{' '}
            <span className='emphasize'>
              {balance} {requestConfig.config.tokenSymbol}
            </span>
            <br />
            Cost of the request:{' '}
            <span className='emphasize'>
              {totalCost} {requestConfig.config.tokenSymbol}
            </span>
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
      checkAuthorization();
    }
  };

  return (
    <div className='action request'>
      <div className='justify'>
        <span className='step emphasize'>1</span>In order to pass the
        authorization, you need to hold at least a total balance of{' '}
        <b>
          {requiredBalance} {requestConfig.config.tokenSymbol}
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

export default Request;

// ! Component to round link
// ! Put updateToast function inside request arguments (with address) to just update with the message
