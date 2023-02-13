/**
 * @notice Constants that can be modified to configure the request
 */

// The address to check balance of
const USER_ADDRESS = "0xc06d127E504a944f63Bc750D8F512556c576F3EF"

// The chains to check their balances
// chainId: the chain id
// tokenAddress: the address of the token to check (LINK)
// rpcUrl: the RPC URL for the chain
const CHAINS = [
  // Goerli
  {
    chainId: 5,
    name: "goerli",
    tokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    rpcUrl: process.env.GOERLI_RPC_URL || "",
  },
  // Mumbai
  {
    chainId: 80001,
    name: "mumbai",
    tokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    rpcUrl: process.env.MUMBAI_RPC_URL || "",
  },
  // Arbitrum Goerli
  {
    chainId: 421613,
    name: "arbitrumGoerli",
    tokenAddress: "0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28",
    rpcUrl: process.env.ARBITRUM_GOERLI_RPC_URL || "",
  },
  // Optimism Goerli
  {
    chainId: 420,
    name: "optimismGoerli",
    tokenAddress: "0xdc2CC710e42857672E7907CF474a69B63B93089f",
    rpcUrl: process.env.OPTIMISM_GOERLI_RPC_URL || "",
  },
]

// Symbol of the token (LINK)
const SYMBOL = "LINK"

/**
 * @notice Getters for the configuration
 */

const getUserAddress = () => USER_ADDRESS

// Get tokenAddresses for all available chains
const getTokenAddresses = () => {
  // name:tokenAddress,name:tokenAddress...
  return CHAINS.map((chain) => `${chain.name}:${chain.tokenAddress}`).join(",")
}

// Get the RPC URLs for all available chains
const getRpcUrls = () => {
  // {chainName:rpcUrl,chainName:rpcUrl}
  return CHAINS.reduce((rpcUrls, chain) => ({ ...rpcUrls, [chain.name]: chain.rpcUrl }), {})
}

// Get the symbol of the token
const getSymbol = () => SYMBOL.toString()

module.exports = {
  getUserAddress,
  getTokenAddresses,
  getRpcUrls,
  getSymbol,
}
