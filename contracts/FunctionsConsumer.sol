// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./dev/functions/FunctionsClient.sol";
// import "@chainlink/contracts/src/v0.8/dev/functions/FunctionsClient.sol"; // Once published
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

import "hardhat/console.sol";
import "./Utils.sol";

/**
 * @title Functions Copns contract
 * @notice This contract is a demonstration of using Functions.
 * @notice NOT FOR PRODUCTION USE
 */
contract FunctionsConsumer is FunctionsClient, ConfirmedOwner {
  using Functions for Functions.Request;

  error MISSING_ARGS();
  error UNAUTHORIZED(string message);

  bytes32 public latestRequestId;
  bytes public latestResponse;
  bytes public latestError;

  // The required balance to be verified for the token
  uint256 public requiredBalance;
  // Is the balance of the user across chains enough to be verified?
  mapping(address => bool) public sufficientBalance;
  // Remember the user address for each request ID
  mapping(bytes32 => address) public rememberAddress;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

  /**
   * @notice Executes once when a contract is created to initialize state variables
   *
   * @param oracle - The FunctionsOracle contract
   */
  constructor(address oracle) FunctionsClient(oracle) ConfirmedOwner(msg.sender) {
    // Set the required balance for each token
    requiredBalance = 10_000_000_000_000_000_000; // 10 LINK
  }

  /**
   * @notice Send a simple request
   * @param source JavaScript source code
   * @param secrets Encrypted secrets payload
   * @param args List of arguments accessible from within the source code
   * @param subscriptionId Billing ID
   */
  function executeRequest(
    string calldata source,
    bytes calldata secrets,
    Functions.Location secretsLocation,
    string[] calldata args,
    uint64 subscriptionId,
    uint32 gasLimit
  ) public onlyOwner returns (bytes32) {
    Functions.Request memory req;
    req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, source);
    if (secrets.length > 0) {
      if (secretsLocation == Functions.Location.Inline) {
        req.addInlineSecrets(secrets);
      } else {
        req.addRemoteSecrets(secrets);
      }
    }

    // Revert if all arguments are not provided
    if (args.length < 3) revert MISSING_ARGS();
    req.addArgs(args);

    bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit, tx.gasprice);
    latestRequestId = assignedReqID;

    // Asociate the request ID with the user address, so we can retrieve it when fulfilling
    // the request
    // We could also retrieve it from the response when fulfilling, but it would require
    // splitting the response into two parts and converting them to the right type
    // which would be more expensive
    address userAddress = Utils.stringToAddress(args[0]);
    rememberAddress[assignedReqID] = userAddress;

    return assignedReqID;
  }

  /**
   * @notice Callback that is invoked once the DON has resolved the request or hit an error
   *
   * @param requestId The request ID, returned by sendRequest()
   * @param response Aggregated response from the user code
   * @param err Aggregated error from the user code or from the execution pipeline
   * Either response or error parameter will be set, but never both
   */
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    // revert('test');
    latestResponse = response;
    latestError = err;

    // Retrieve the user balance
    uint256 userBalance = abi.decode(response, (uint256));
    // Retrieve the user address for this request
    // ! It won't work when simulating the request as the requestId will be 0x00...01
    address userAddress = rememberAddress[requestId];

    // Check if the balance is sufficient
    sufficientBalance[userAddress] = userBalance >= requiredBalance;

    emit OCRResponse(requestId, response, err);
  }

  /**
   * @notice Any function that can be executed only if the called has a sufficient balance
   */
  function executeAuthorizedFunction() external {
    if (!sufficientBalance[msg.sender]) revert UNAUTHORIZED("Not enough balance to execute this function");

    // ...
  }

  /**
   * @notice Update the required balance for the token
   */
  function updateRequiredBalance(uint256 _newBalance) external onlyOwner {
    requiredBalance = _newBalance;
  }

  function updateOracleAddress(address _oracle) public onlyOwner {
    setOracle(_oracle);
  }

  function addSimulatedRequestId(address _oracleAddress, bytes32 _requestId) public onlyOwner {
    addExternalRequest(_oracleAddress, _requestId);
  }
}
