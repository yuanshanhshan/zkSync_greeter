import { Contract, Wallet, Provider } from 'zksync-web3'
import * as ethers from 'ethers'

import { abi } from '../artifacts/contracts/Greeter.sol/Greeter.json'
// load env file
import dotenv from 'dotenv'
dotenv.config()

// Greeter contract ABI for example
const ABI = abi

// HTTPS RPC endpoints (from local node)
const L1_RPC_ENDPOINT = process.env.L1_RPC_ENDPOINT
const L2_RPC_ENDPOINT = process.env.L2_RPC_ENDPOINT

const WALLET_PRIV_KEY = process.env.WALLET_PRIVATE_KEY || ''

if (!WALLET_PRIV_KEY) {
  throw new Error('Wallet private key is not configured in env file')
}

const L2_CONTRACT_ADDRESS = process.env.L2_CONTRACT_ADDRESS //

async function main() {
  console.log(`Running script for L1-L2 transaction`)

  // Initialize the wallet.
  const l1provider = new Provider(L1_RPC_ENDPOINT)
  const l2provider = new Provider(L2_RPC_ENDPOINT)
  const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider)

  // console.log(`L1 Balance is ${await wallet.getBalanceL1()}`);
  console.log(`L2 Balance is ${await wallet.getBalance()}`)

  // retrieve L1 gas price
  const l1GasPrice = await l1provider.getGasPrice()
  console.log(`L1 gasPrice ${ethers.utils.formatEther(l1GasPrice)} ETH`)
  if (!L2_CONTRACT_ADDRESS) {
    throw new Error('L2 contract address is not configured in env file')
  }
  const contract = new Contract(L2_CONTRACT_ADDRESS, ABI, wallet)

  const msg = await contract.greet()

  console.log(`Message in contract is ${msg}`)

  const message = `Updated at ${new Date().toUTCString()}`

  const tx = await contract.populateTransaction.setGreeting(message)

  // call to RPC method zks_estimateGasL1ToL2 to estimate L2 gas limit
  const l2GasLimit = await l2provider.estimateGasL1(tx)

  console.log(`L2 gasLimit ${l2GasLimit.toString()}`)

  const baseCost = await wallet.getBaseCost({
    // L2 computation
    gasLimit: l2GasLimit,
    // L1 gas price
    gasPrice: l1GasPrice,
  })

  console.log(
    `Executing this transaction will cost ${ethers.utils.formatEther(
      baseCost
    )} ETH`
  )

  const iface = new ethers.utils.Interface(ABI)
  const calldata = iface.encodeFunctionData('setGreeting', [message])

  const txReceipt = await wallet.requestExecute({
    contractAddress: L2_CONTRACT_ADDRESS,
    calldata,
    l2GasLimit: l2GasLimit,
    refundRecipient: wallet.address,
    overrides: {
      // send the required amount of ETH
      value: baseCost,
      gasPrice: l1GasPrice,
    },
  })

  console.log('L1 tx hash is :>> ', txReceipt.hash)

  txReceipt.wait()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
