const Content = () => {
  return (
    <main>
      <div className='overview'>
        <div className='title'>Overview</div>
        <div className='content'>
          <p>
            This app allows users to access a{' '}
            <b>cross-chain ERC20 token-gated smart contract</b>, from a specific
            chain (Polygon Mumbai).
          </p>
          <p>
            If they hold a sufficient combined balance accross multiple chains,
            they can{' '}
            <b>
              request authorization to run specific functions on the contract
            </b>
            .
          </p>
        </div>
      </div>
      <div className='instructions'>
        <div className='title'>Instructions</div>
        <div className='content'>
          <p>
            Follow the instructions below to test the app with your own wallet.
          </p>

          <ol>
            <li>
              <b>Connect your wallet</b> to the app and select the Polygon
              Mumbai testnet.
            </li>
            <li>
              {' '}
              Click the <span className='emphasize'>
                Request authorization
              </span>{' '}
              button to run the request and <b>get authorized</b> in the
              contract.
            </li>
            <li>
              If you were successfully verified, <b>enter a new number</b> and
              run the <span className='emphasize'>Update number</span> function,
              which is <b>restricted to authorized addresses</b>.
            </li>
          </ol>
        </div>
      </div>
      <div className='interact'></div>
    </main>
  );
};

export default Content;
