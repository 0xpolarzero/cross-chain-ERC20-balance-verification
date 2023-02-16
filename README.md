# Cross-chain ERC20 token-gated access

## Overview

This project uses Chainlink Functions to retrieve the balance of an Ethereum address for an ERC20 token accross multiple blockchains. The aggregated balance is then brought back to the original chain to gate access to specific functions in the smart contract.

Chainlink Functions Starter Kit: https://github.com/smartcontractkit/functions-hardhat-starter-kit

## Directory Structure

For quick testing, visit [the `hardhat` directory](https://github.com/0xpolarzero/cross-chain-ERC20-balance-verification/tree/main/hardhat) and follow the instructions in the README.

### `hardhat`

Contains all the smart contracts and scripts for deploying, managing subscriptions and making requests. A 'standalone' script is also available for quick testing, using an already deployed contract and subscription.

### `frontend`

A frontend implementation using Next.js, enabling access to functions in a non-hardhat environment. Essentially, some tasks are ported to raw ethers calls, and the configuration for the request accepts some parameters (user address, network).

Visit the README in these directories for more information.

## Recommendations

Please keep in mind that everything in this repository is intended for testing purposes. If you would like to test, and deploy your own contracts, **always use a separate wallet reserved for testing**.

## Contact

If you have any questions, feel free to reach out to me on [Twitter](https://twitter.com/0xpolarzero) or by [email (0xpolarzero@gmail.com)](mailto:0xpolarzero@gmail.com).
