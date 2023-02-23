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
cd cross-chain-ERC20-balance-verification/frontend
yarn
```

3. Copy the `.env.example` file to `.env.local` and fill in the required variables

```bash
cp .env.example .env.local
```

```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_PRIVATE_KEY=your_wallet_private_key
```

4. Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Recommendations

- If you would like to use your own deployed contract and subscription, update the variables in `systems/implementation/helper-config.js`. You can add/remove chains included in the balance aggregation as well, and change the token address. If the consumer contract is modified, you will need to update that abi as well, in the `systems/abi/` folder.

- If you modify the source code executed in the DON, you will need to update the line that decodes the response in `systems/implementation/request.js`.

```js
const decodedOutput = BigInt('0x' + result.slice(2).slice(-64));
```

This is a personal adaptation of Chainlink Functions in a different environment, which means that it is highly prone to errors. Please keep in mind that everything in this repository is intended for testing purposes.
