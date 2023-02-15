const functionsConsumerAbi = require("../../build/artifacts/contracts/FunctionsConsumer.sol/FunctionsConsumer.json")
const functionsOracleAbi = require("../../build/artifacts/contracts/dev/functions/FunctionsOracle.sol/FunctionsOracle.json")
const functionsBillingRegistryAbi = require("../../build/artifacts/contracts/dev/functions/FunctionsBillingRegistry.sol/FunctionsBillingRegistry.json")
const { ethers } = require("ethers")

/**
 * @notice Configuration for the standalone request
 * @dev These can be customized with your own values
 */
const config = {
  contractAddress: "0x3700813aA6956BA06f5DEe33a0d9Eade89B9C18a",
  subId: 96,
  network: { name: "mumbai" },
  gasLimit: 100_000,
}

/**
 * @notice The ABIs should be retrieved to grab the contract in the request,
 * since we're not using hardhat anymore
 */
const abi = {
  functionsConsumerAbi: functionsConsumerAbi.abi,
  functionsOracleAbi: functionsOracleAbi.abi,
  functionsBillingRegistryAbi: functionsBillingRegistryAbi.abi,
}

/**
 * @notice The provider should be setup as well for the same reason
 */
const configProvider = () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC_URL)
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  const getProvider = () => provider
  const getSigner = () => signer

  return { getProvider, getSigner }
}

module.exports = { config, abi, configProvider }
