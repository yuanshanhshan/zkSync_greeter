// Import the relevant libraries
import * as zksync from 'zksync-web3'
import * as ethers from 'ethers'
import dotenv from 'dotenv'
dotenv.config()

const SENDER_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || ''
// Create zkSync Era provider on testnet
const zkSyncProvider = new zksync.Provider('https://testnet.era.zksync.dev')
console.log(SENDER_PRIVATE_KEY)
// Create a zkSync wallet for the sender
const zkSyncWallet = new zksync.Wallet(SENDER_PRIVATE_KEY, zkSyncProvider)

// Store the recipient public key
const receiverWallet = '0x086e5CC121a5621e1142ff8a4105C825220284DE'

// Store the L2 token address
const _DAI = '0x10E77EcB6d8754F3aaCaACb3c814441679D8455C'

async function l2transfer() {
  // Create a variable to store the token amount in wei to transfer
  const amount = ethers.BigNumber.from('1000000000000000000')

  //Show the balance of wallets before transferring
  console.log(
    `FROM this L2 wallet: "${ethers.utils.formatUnits(
      await zkSyncProvider.getBalance(zkSyncWallet.address, 'latest', _DAI),
      18
    )}" DAI`
  )
  console.log(
    `TO receiver wallet: "${ethers.utils.formatUnits(
      await zkSyncProvider.getBalance(receiverWallet, 'latest', _DAI),
      18
    )}" DAI`
  )

  const transfer = await zkSyncWallet.transfer({
    to: receiverWallet,
    token: _DAI,
    amount,
  })

  // Await commitment
  const transferReceipt = await transfer.wait()
  console.log(`Tx transfer hash for DAI: ${transferReceipt.blockHash}`)

  // Show the balance of wallets after transferring
  console.log(
    `FROM this L2 wallet: "${ethers.utils.formatUnits(
      await zkSyncProvider.getBalance(zkSyncWallet.address, 'latest', _DAI),
      18
    )}" DAI`
  )
  console.log(
    `TO receiver wallet: "${ethers.utils.formatUnits(
      await zkSyncProvider.getBalance(receiverWallet, 'latest', _DAI),
      18
    )}" DAI`
  )
}

l2transfer()
