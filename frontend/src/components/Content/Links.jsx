import { Divider, Tooltip } from 'antd';
import { config } from '@/systems/implementation/helper-config';

const Links = () => {
  return (
    <div className='links'>
      <div className='title'>
        <Divider orientation='left' style={{ margin: 0 }}>
          Links
        </Divider>
      </div>
      <div className='content'>
        <p>
          <a
            href={`https://mumbai.polygonscan.com/address/${config.contractAddress}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            Client contract on Polygonscan{' '}
            <span className='min'>
              (<ShrinkedAddress address={config.contractAddress} />)
            </span>
          </a>
        </p>
        <p>
          <a
            href='https://github.com/0xpolarzero/cross-chain-ERC20-balance-verification'
            target='_blank'
            rel='noopener noreferrer'
          >
            Project's Github repository{' '}
            <span className='min'>
              (cross-chain-erc20-balance-verification)
            </span>
          </a>
        </p>
        <p>
          <a
            href='https://github.com/smartcontractkit/functions-hardhat-starter-kit'
            target='_blank'
            rel='noopener noreferrer'
          >
            Chainlink Functions Github repository{' '}
            <span className='min'>(functions-hardhat-starter-kit)</span>
          </a>
        </p>
      </div>
    </div>
  );
};

const ShrinkedAddress = ({ address }) => {
  console.log(address);
  const shrinked = address.slice(0, 6) + '...' + address.slice(-4);

  return <Tooltip title={address}>{shrinked}</Tooltip>;
};

export default Links;
