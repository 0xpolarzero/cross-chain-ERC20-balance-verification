const { ethers } = require('ethers');
const functionsConsumerAbi = require('../abi/FunctionsConsumer.json');
const functionsOracleAbi = require('../abi/FunctionsOracle.json');
const functionsBillingRegistryAbi = require('../abi/FunctionsBillingRegistry.json');

/**
 * @notice Constants that are used for the request
 * @dev Modify these variables to customize the request
 * @param USER_ADDRESS {string} The address to check balance of
 * @param CHAINS {Array} The chains to check their balances
 * @param SYMBOL {string} Symbol of the token - it will be used in the contract
 * to get the balance required for verification for that token
 */

// The chains to check their balances
// name: the name of the chain, for identification purposes
// chainId: the chain id, for identification purposes as well
// tokenAddress: the address of the token to check on that chain
// rpcUrl: the RPC URL
const CHAINS = [
  // Goerli
  {
    chainId: 5,
    name: 'goerli',
    tokenAddress: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    rpcUrl: process.env.GOERLI_RPC_URL || '',
  },
  // Mumbai
  {
    chainId: 80001,
    name: 'mumbai',
    tokenAddress: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    rpcUrl: process.env.MUMBAI_RPC_URL || '',
  },
  // Arbitrum Goerli
  {
    chainId: 421613,
    name: 'arbitrumGoerli',
    tokenAddress: '0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28',
    rpcUrl: process.env.ARBITRUM_GOERLI_RPC_URL || '',
  },
  // Optimism Goerli
  {
    chainId: 420,
    name: 'optimismGoerli',
    tokenAddress: '0xdc2CC710e42857672E7907CF474a69B63B93089f',
    rpcUrl: process.env.OPTIMISM_GOERLI_RPC_URL || '',
  },
];

/**
 * @notice Configuration for the standalone request
 * @dev These can be customized with your own values
 */
const config = {
  contractAddress: '0xE60145ff461c2FA9Cc8fF0C9e04d360Bb7349A16',
  subId: 92,
  network: { name: 'mumbai' },
  gasLimit: 100_000,
};

/**
 * @notice Getters for the configuration
 * @dev Do not modify these functions
 */

// Get tokenAddresses for all available chains
const getTokenAddresses = () => {
  // name:tokenAddress,name:tokenAddress...
  return CHAINS.map((chain) => `${chain.name}:${chain.tokenAddress}`).join(',');
};

// Get the RPC URLs for all available chains
const getRpcUrls = () => {
  // {chainName:rpcUrl,chainName:rpcUrl}
  return CHAINS.reduce(
    (rpcUrls, chain) => ({ ...rpcUrls, [chain.name]: chain.rpcUrl }),
    {},
  );
};

/**
 * @notice The ABIs should be retrieved to grab the contract in the request,
 * since we're not using hardhat anymore
 */
const abi = {
  functionsConsumerAbi: functionsConsumerAbi.abi,
  functionsOracleAbi: functionsOracleAbi.abi,
  functionsBillingRegistryAbi: functionsBillingRegistryAbi.abi,
};

/**
 * @notice The provider should be setup as well for the same reason
 */
const configProvider = () => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://polygon-mumbai.g.alchemy.com/v2/' +
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  );
  const signer = new ethers.Wallet(
    process.env.NEXT_PUBLIC_PRIVATE_KEY,
    provider,
  );

  const getProvider = () => provider;
  const getSigner = () => signer;

  return { getProvider, getSigner };
};

module.exports = {
  config,
  getTokenAddresses,
  getRpcUrls,
  abi,
  configProvider,
};
