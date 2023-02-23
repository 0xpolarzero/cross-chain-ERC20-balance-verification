import { Divider } from 'antd';

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
          If they hold a sufficient combined balance across multiple chains,
          they can{' '}
          <b>request authorization to run specific functions on the contract</b>
          .
        </p>
      </div>
    </div>
  );
};

export default Overview;
