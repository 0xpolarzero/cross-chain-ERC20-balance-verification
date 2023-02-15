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

  // All authorized users
  address[] private authorizedUsers;
  // The required balance to be verified for the token
  uint256 private requiredBalance;
  // The number that can be updated only if authorized
  uint256 private currentNumber;

  // Is the balance of the user across chains enough to be verified?
  mapping(address => bool) private sufficientBalance;
  // Remember the user address for each request ID
  mapping(bytes32 => address) private rememberAddress;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
  event NumberUpdated(uint256 num);

  /**
   * @notice Modifier that checks if the caller was previously authorized
   * @dev A user can be authorized by running the request with a sufficient balance
   * across the chains specified in the request
   * In this current example, the user will stay authorized even if they run the request or the
   * authorized function again with a lower balance
   */
  modifier onlyAuthorized() {
    if (!sufficientBalance[msg.sender]) revert UNAUTHORIZED("Not enough balance to execute this function");
    _;
  }

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
    if (args.length < 2) revert MISSING_ARGS();
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
    // If a user was previously authorized, but runs the request again without the required balance,
    // their authorization won't be removed
    if (userBalance >= requiredBalance) {
      // Add the user to the list of authorized users
      authorizedUsers.push(userAddress);
      // Authorize the user to use the function
      sufficientBalance[userAddress] = true;
    }

    emit OCRResponse(requestId, response, err);
  }

  /**
   * @notice Any function that can be executed only if the called has a sufficient balance
   * @param _num The new number to assign
   */
  function executeAuthorizedFunction(uint256 _num) external onlyAuthorized {
    currentNumber = _num;
    emit NumberUpdated(_num);

    // This function could also call another contract with a specified function signature
    // and arguments, e.g. from a frontend, therefore being a verifier and gateway to that other contract
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

  /**
   * @notice Get the list of authorized users
   */
  function getAuthorizedUsers() external view returns (address[] memory) {
    return authorizedUsers;
  }

  /**
   * @notice Get the authorization status of a user
   */
  function getAuthorizationStatus(address _user) external view returns (bool) {
    return sufficientBalance[_user];
  }

  /**
   * @notice Get the required balance for the token
   */
  function getRequiredBalance() external view returns (uint256) {
    return requiredBalance;
  }

  /**
   * @notice Get the current number
   */
  function getCurrentNumber() external view returns (uint256) {
    return currentNumber;
  }
}
