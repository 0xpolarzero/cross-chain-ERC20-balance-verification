// The address to check balance of
const USER_ADDRESS = "0x8e2c250A85D97c94405471C261BF28feC5D6b0c9"

// The chains to check their balances
// chainId: the chain id
// tokenAddress: the address of the token to check (LINK)
const CHAINS = [
  // Goerli
  { chainId: 5, tokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB" },
  // Mumbai
  { chainId: 80001, tokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB" },
  // Arbitrum Goerli
  { chainId: 421613, tokenAddress: "0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28" },
  // Optimism Goerli
  { chainId: 420, tokenAddress: "0xdc2CC710e42857672E7907CF474a69B63B93089f" },
]

// Chains with an available RPC URL in the API
const AVAILABLE_CHAINS = [5, 420, 80001, 421613]

// chainId:tokenAddress,chainId:tokenAddress...
const chainsToString = (chains) => {
  return chains
    .filter((chain) => AVAILABLE_CHAINS.includes(chain.chainId))
    .map((chain) => `${chain.chainId}:${chain.tokenAddress}`)
    .join(",")
}

module.exports = {
  USER_ADDRESS,
  CHAINS,
  AVAILABLE_CHAINS,
  chainsToString,
}
