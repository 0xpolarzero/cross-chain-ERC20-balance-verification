const {
  getTokenAddresses,
  getRpcUrls,
} = require('./implementation/helper-config');
const source = require('./implementation/verify-balances');

const Location = {
  Inline: 0,
  Remote: 1,
};

const CodeLanguage = {
  JavaScript: 0,
};

const ReturnType = {
  uint: 'uint256',
  uint256: 'uint256',
  int: 'int256',
  int256: 'int256',
  string: 'string',
  bytes: 'Buffer',
  Buffer: 'Buffer',
};

// Configure the request by setting the fields below
const getRequestConfig = (userAddress) => {
  return {
    // location of source code (only Inline is currently supported)
    codeLocation: Location.Inline,
    // location of secrets (Inline or Remote)
    secretsLocation: Location.Inline,
    // code language (only JavaScript is currently supported)
    codeLanguage: CodeLanguage.JavaScript,
    // string containing the source code to be executed
    source,
    //source: fs.readFileSync('./API-request-example.js').toString(),
    // secrets can be accessed within the source code with `secrets.varName` (ie: secrets.apiKey)
    secrets: getRpcUrls(),
    // ETH wallet key used to sign secrets so they cannot be accessed by a 3rd party
    walletPrivateKey: process.env['NEXT_PUBLIC_PRIVATE_KEY'],
    // args (string only array) can be accessed within the source code with `args[index]` (ie: args[0]).
    args: [userAddress, getTokenAddresses()],
    // expected type of the returned value
    expectedReturnType: ReturnType.uint256,
    // Redundant URLs which point to encrypted off-chain secrets
    secretsURLs: [],
    // Default offchain secrets object used by the `functions-build-offchain-secrets` command
    globalOffchainSecrets: {},
    // Per-node offchain secrets objects used by the `functions-build-offchain-secrets` command
    perNodeOffchainSecrets: [],
  };
};

module.exports = getRequestConfig;
