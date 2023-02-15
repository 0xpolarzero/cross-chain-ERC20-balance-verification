import { ConnectKitButton } from 'connectkit';

const Header = () => {
  return (
    <header>
      <div className='title'>Authorize</div>
      {/* <button className='button-primary'>Connect</button> */}
      <ConnectKitButton></ConnectKitButton>
    </header>
  );
};

export default Header;
