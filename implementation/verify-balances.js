// Address to check balance of
const userAddress = args[0]
// The chains to check their balances
// returns name:tokenAddress,name:tokenAddress...
const tokens = args[1].split(",").map((tokenAddress) => {
  const [chain, address] = tokenAddress.split(":")
  return { chain, address }
})
// We don't need the symbol of the token here, only in the contract (args[2])

// Check if there is indeed a secret (RPC URL) for each chain
tokens.forEach((token) => {
  if (!secrets[token.chain]) {
    throw new Error(`No secret found for chain ${token.chain}`)
  }
})

// Prepare requests for each chain
const requests = tokens.map((token, index) => {
  return Functions.makeHttpRequest({
    url: secrets[token.chain],
    method: "POST",
    data: {
      id: index,
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          to: token.address,
          // The signature of balanceOf(address) + the user address without the 0x prefix
          data: "0x70a08231000000000000000000000000" + userAddress.slice(2),
        },
        "latest",
      ],
    },
  })
})

// Send all requests
const responses = await Promise.all(requests)

// Parse responses
const balances = responses.map((response) => {
  // Convert the result to a number
  return parseInt(response.data.result, 16) ?? 0
})

// Check if the minimum amount is reached accross all chains
const totalBalance = balances.reduce((a, b) => a + b, 0)

// Return the balance of the user
return Functions.encodeString(userAddress + totalBalance.toString())
