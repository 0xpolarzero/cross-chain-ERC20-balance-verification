import { Divider } from 'antd';

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
            <b>Connect your wallet</b> to the app and select the{' '}
            <b>Polygon Mumbai</b> testnet.
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

export default Instructions;
