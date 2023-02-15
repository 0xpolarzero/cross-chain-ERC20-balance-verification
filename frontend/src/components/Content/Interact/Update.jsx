import { useState, useEffect } from 'react';
import { readContract, writeContract, prepareWriteContract } from '@wagmi/core';
import { Button, InputNumber, Tooltip } from 'antd';
import { toast } from 'react-toastify';
import { requestConfig } from '@/systems';

const Update = ({ requiredBalance, isAuthorized }) => {
  const [number, setNumber] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const getCurrentNumber = async () => {
    const data = await readContract({
      address: requestConfig.config.contractAddress,
      abi: requestConfig.abi.functionsConsumerAbi,
      functionName: 'getCurrentNumber',
    });

    setCurrentNumber(data.toString());
  };

  const updateNumber = async () => {
    if (!isAuthorized) {
      toast.error('You first need to pass the authorization process');
      return;
    }
    if (!number) {
      toast.error('You need to enter a new number (positive integer)');
      return;
    }

    setIsUpdating(true);
    const toastId = toast.loading('Updating number...');

    try {
      const config = await prepareWriteContract({
        address: requestConfig.config.contractAddress,
        abi: requestConfig.abi.functionsConsumerAbi,
        functionName: 'executeAuthorizedFunction',
        args: [number],
      });
      const data = await writeContract(config);
      await data.wait(1);

      toast.update(toastId, {
        render: 'Number updated successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.log(err);
      toast.update(toastId, {
        render: 'Error updating number',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsUpdating(false);
    }

    getCurrentNumber();
  };

  useEffect(() => {
    getCurrentNumber();
  }, []);

  return (
    <div className='action update'>
      <div className='justify'>
        <span className='step emphasize'>2</span>If you successfully passed the
        authorization in the previous step, you can update the number in the
        contract.
      </div>
      <div className='number'>
        <span>Current number</span>
        <span className='box'>{currentNumber}</span>
        <span>New number</span>
        <InputNumber
          type='number'
          placeholder='Enter a new positive number'
          style={{ fontSize: '1rem', width: '100%' }}
          onChange={(e) => setNumber(e)}
          value={number}
          min={0}
          max={2 ** 256 - 1}
          disabled={!isAuthorized}
        />
      </div>
      <Tooltip
        title={
          isAuthorized
            ? ''
            : `You first need to pass the authorization process to prove that you own at least ${requiredBalance} ${requestConfig.config.tokenSymbol} on the specified chains.`
        }
      >
        <Button
          onClick={updateNumber}
          disabled={!isAuthorized}
          loading={isUpdating}
        >
          Update number
        </Button>
      </Tooltip>
    </div>
  );
};

export default Update;
