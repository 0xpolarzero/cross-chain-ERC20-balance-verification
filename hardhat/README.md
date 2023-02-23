# Cross-chain ERC20 token-gated access

## Overview

This project uses Chainlink Functions to retrieve the balance of an Ethereum address for an ERC20 token across multiple blockchains. The aggregated balance is then brought back to the original chain to gate access to specific functions in the smart contract.

Chainlink Functions Starter Kit: https://github.com/smartcontractkit/functions-hardhat-starter-kit

## How to setup

1. Clone the repo

```bash
git clone git@github.com:0xpolarzero/cross-chain-ERC20-balance-verification.git
```

2. Install dependencies

```bash
cd cross-chain-ERC20-balance-verification/hardhat
yarn
```

3. Copy the `.env.example` file to `.env` and fill in the required variables

```bash
cp .env.example .env
```

```bash
# Make sure to fill in the RPC URLs for the networks you want to use for:
# - deployment
# - fetching balance (see implementation/helper-config.js)
POLYGON_RPC_URL=your_polygon_rpc_url
MUMBAI_RPC_URL=your_mumbai_rpc_url
GOERLI_RPC_URL=your_goerli_rpc_url
ARBITRUM_GOERLI_RPC_URL=your_arbitrum_goerli_rpc_url
OPTIMISM_GOERLI_RPC_URL=your_optimism_goerli_rpc_url
PRIVATE_KEY=your_wallet_private_key
# Optional - If you want to verify the contract
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
# Optional - If you want to report gas usage
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
REPORT_GAS=true/false
```

4. Fill in the parameters in the `implementation/helper-config.js` file (see there for more details)

5. Update the balance required for verification in the contract `implementation/contracts/FunctionsConsumer.sol`. It can be set in the constructor and updated with the `updateRequiredBalance` function.

## How to use

All these instructions are available with more details in the [Chainlink Functions repo](https://github.com/smartcontractkit/functions-hardhat-starter-kit).

### Simulate a request

**The simulation will fail to allow/restrict access to the function for the user, since it uses the requestId to do so and the simulation returns a fake id during the fulfillment (`0x0000...01`).**

```bash
yarn hardhat functions-simulate
```

### Use on an actual network

1. Deploy and verify the contract

```bash
# Set ETHERSCAN_API_KEY/POLYGONSCAN_API_KEY in .env if setting --verify to true
yarn hardhat functions-deploy-client --network network_name_here --verify true
```

2. Grab the deployed contract address in the console.

3. Create, fund and authorize a Functions subscription

```bash
yarn hardhat functions-sub-create --network network_name_here --amount LINK_funding_amount_here --contract 0xDeployed_client_contract_address_here
```

4. Grab the subscription ID in the console.

5. Execute a request

```bash
yarn hardhat functions-request --network network_name_here --contract 0xDeployed_client_contract_address_here --subid subscription_id_number_here
```

## Steps to run in a non-hardhat environment (e.g. frontend)

See `implementation/standalone/request-standalone` for an example.

1. Copy the `tasks/Functions-client/request.js` file to a new folder

2. Replace the hardhat task format to a regular async function

   - Remove the `task` function call
   - Replace the `taskArgs` with variables (`contractAddress`, `subscriptionId`, `network`, `gasLimit`)

3. Remove console confirmations & simulations

4. Import the `requestConfig` directly from the root `Functions-request-config.js` instead of building it

### Test that standalone function

1. Follow the deployment & funding steps above, up to executing a request.

2. Fill in the variables in the `implementation/standalone/helper-config-standalone.js` file, for the `config` object (`contractAddress`, `subId`, `network`).

3. Run the standalone function

It will perform the same as the hardhat task, but without the hardhat environment. IT also ignores the console confirmations, simulation & gas estimation.

```bash
node implementation/standalone/request-standalone.js
```
