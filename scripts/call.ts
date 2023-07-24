import { Contract, Web3Provider, Provider } from 'zksync-web3'
import { ethers } from 'ethers'
// Process Env Variables
import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/.env' })
const PRIVATEKEY = process.env.WALLET_PRIVATE_KEY
const GREETER_CONTRACT_ADDRESS = '0xe00c276e01e100A5F53529F0CfF22e9d40713FD0'
const GREETER_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_greeting',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'greet',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_greeting',
        type: 'string',
      },
    ],
    name: 'setGreeting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

class Call {
  provider: any
  signer: any
  contract: any

  initializeProviderAndSigner() {
    this.provider = new Provider('https://testnet.era.zksync.dev')
    // Note that we still need to get the Metamask signer
    const privateKey = PRIVATEKEY
    if (privateKey != undefined) {
      this.signer = new ethers.Wallet(privateKey, this.provider)
      this.contract = new Contract(
        GREETER_CONTRACT_ADDRESS,
        GREETER_CONTRACT_ABI,
        this.signer
      )
      console.log(`${JSON.stringify(this.contract)}`)
    }
  }
  async getGreeting() {
    return await this.contract.greet()
  }

  async getBalance() {
    const balanceInUnits = await this.signer.getBalance(this.signer.pubulicKey)
    console.log(balanceInUnits)
  }
}

;(async () => {
  const call = new Call()

  call.initializeProviderAndSigner()

  // console.log(await call.getGreeting())

  await call.getBalance()
})()
