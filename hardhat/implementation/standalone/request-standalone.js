const { ethers } = require("ethers")
const { buildRequest, getDecodedResultLog } = require("../../FunctionsSandboxLibrary")
const { VERIFICATION_BLOCK_CONFIRMATIONS, networkConfig } = require("../../network-config")

// Added variables for the standalone
const { config, abi, configProvider } = require("./helper-config-standalone")
const { contractAddress, subId, network, gasLimit: askGasLimit } = config
const { functionsConsumerAbi, functionsOracleAbi, functionsBillingRegistryAbi } = abi
const { getSigner } = configProvider()
// Get requestConfig directly without simulation
const requestConfig = require("../../Functions-request-config.js")

const request = async () => {
  // A manual gas limit is required as the gas limit estimated by Ethers is not always accurate
  const overrides = {
    gasLimit: 500000,
  }

  if (network.name === "hardhat") {
    throw Error(
      'This command cannot be used on a local development chain.  Specify a valid network or simulate an Functions request locally with "npx hardhat functions-simulate".'
    )
  }

  if (network.name === "goerli") {
    overrides.maxPriorityFeePerGas = ethers.utils.parseUnits("50", "gwei")
    overrides.maxFeePerGas = ethers.utils.parseUnits("50", "gwei")
  }

  // Get the required parameters
  const gasLimit = parseInt(askGasLimit ?? "100000")
  if (gasLimit > 300000) {
    throw Error("Gas limit must be less than or equal to 300,000")
  }

  // Attach to the required contracts
  // Do it the ethers way, without hardhat
  const signer = getSigner()
  const clientContract = new ethers.Contract(contractAddress, functionsConsumerAbi, signer)
  const oracle = new ethers.Contract(networkConfig[network.name]["functionsOracle"], functionsOracleAbi, signer)
  const registryAddress = await oracle.getRegistry()
  const registry = new ethers.Contract(registryAddress, functionsBillingRegistryAbi, signer)

  // Check that the subscription is valid
  let subInfo
  try {
    subInfo = await registry.getSubscription(subId)
  } catch (error) {
    if (error.errorName === "InvalidSubscription") {
      throw Error(`Subscription ID "${subId}" is invalid or does not exist`)
    }
    throw error
  }
  // Validate the client contract has been authorized to use the subscription
  const existingConsumers = subInfo[2].map((addr) => addr.toLowerCase())
  if (!existingConsumers.includes(contractAddress.toLowerCase())) {
    throw Error(`Consumer contract ${contractAddress} is not registered to use subscription ${subId}`)
  }

  // Fetch the DON public key from on-chain
  const DONPublicKey = await oracle.getDONPublicKey()
  // Remove the preceding 0x from the DON public key
  requestConfig.DONPublicKey = DONPublicKey.slice(2)
  // Build the parameters to make a request from the client contract
  const request = await buildRequest(requestConfig)

  // Use a promise to wait & listen for the fulfillment event before returning
  await new Promise(async (resolve, reject) => {
    let requestId

    // Initiate the listeners before making the request
    // Listen for fulfillment errors
    oracle.on("UserCallbackError", async (eventRequestId, msg) => {
      if (requestId == eventRequestId) {
        console.log("Error in client contract callback function")
        console.log(msg)
      }
    })
    oracle.on("UserCallbackRawError", async (eventRequestId, msg) => {
      if (requestId == eventRequestId) {
        console.log("Raw error in client contract callback function")
        console.log(Buffer.from(msg, "hex").toString())
      }
    })
    // Listen for successful fulfillment
    let billingEndEventReceived = false
    let ocrResponseEventReceived = false
    clientContract.on("OCRResponse", async (eventRequestId, result, err) => {
      // Ensure the fulfilled requestId matches the initiated requestId to prevent logging a response for an unrelated requestId
      if (eventRequestId !== requestId) {
        return
      }

      console.log(`Request ${requestId} fulfilled!`)
      if (result !== "0x") {
        console.log(
          `Response returned to client contract represented as a hex string: ${result}\n${getDecodedResultLog(
            require("../../Functions-request-config"),
            result
          )}`
        )
      }
      if (err !== "0x") {
        console.log(`Error message returned to client contract: "${Buffer.from(err.slice(2), "hex")}"\n`)
      }
      ocrResponseEventReceived = true
      if (billingEndEventReceived) {
        return resolve()
      }
    })
    // Listen for the BillingEnd event, log cost breakdown & resolve
    registry.on(
      "BillingEnd",
      async (
        eventRequestId,
        eventSubscriptionId,
        eventSignerPayment,
        eventTransmitterPayment,
        eventTotalCost,
        eventSuccess
      ) => {
        if (requestId == eventRequestId) {
          // Check for a successful request & log a mesage if the fulfillment was not successful
          console.log(`Transmission cost: ${ethers.utils.formatUnits(eventTransmitterPayment, 18)} LINK`)
          console.log(`Base fee: ${ethers.utils.formatUnits(eventSignerPayment, 18)} LINK`)
          console.log(`Total cost: ${ethers.utils.formatUnits(eventTotalCost, 18)} LINK\n`)
          if (!eventSuccess) {
            console.log(
              "Error encountered when calling fulfillRequest in client contract.\n" +
                "Ensure the fulfillRequest function in the client contract is correct and the --gaslimit is sufficient."
            )
            return resolve()
          }
          billingEndEventReceived = true
          if (ocrResponseEventReceived) {
            return resolve()
          }
        }
      }
    )
    // Initiate the on-chain request after all listeners are initialized
    console.log(`\nRequesting new data for FunctionsConsumer contract ${contractAddress} on network ${network.name}`)
    const requestTx = await clientContract.executeRequest(
      request.source,
      request.secrets ?? [],
      requestConfig.secretsLocation,
      request.args ?? [],
      subId,
      gasLimit,
      overrides
    )

    // If a response is not received within 5 minutes, the request has failed
    setTimeout(
      () =>
        reject(
          "A response not received within 5 minutes of the request being initiated and has been canceled. Your subscription was not charged. Please make a new request."
        ),
      300_000
    )
    console.log(
      `Waiting ${VERIFICATION_BLOCK_CONFIRMATIONS} blocks for transaction ${requestTx.hash} to be confirmed...`
    )

    const requestTxReceipt = await requestTx.wait(VERIFICATION_BLOCK_CONFIRMATIONS)
    requestId = requestTxReceipt.events[2].args.id
    console.log(`\nRequest ${requestId} initiated`)
    console.log(`Waiting for fulfillment...\n`)
  })
}

// module.exports = request

request()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
