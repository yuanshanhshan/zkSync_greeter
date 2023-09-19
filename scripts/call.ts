import { Contract, Web3Provider, Provider } from 'zksync-web3'
import { ethers } from 'ethers'
import { abi } from '../artifacts-zk/contracts/Greeter.sol/Greeter.json'
// Process Env Variables
import * as dotenv from 'dotenv'
dotenv.config()

//HTTPS RPC endpoints
const L1_RPC_ENDPOINT = process.env.L1_RPC_ENDPOINT
const L2_RPC_ENDPOINT = process.env.L2_RPC_ENDPOINT

const PRIVATEKEY = process.env.WALLET_PRIVATE_KEY || ''

const GREETER_CONTRACT_ADDRESS = '0x5778A1Aa04d2f13166030D39F79d6D0Df8039c0B'
if (!PRIVATEKEY) {
  console.log('Please set your private key in the .env file')
  process.exit(1)
}

const GREETER_CONTRACT_ABI = abi

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
    console.log(balanceInUnits.toString())
  }
}

;(async () => {
  const call = new Call()

  call.initializeProviderAndSigner()

  console.log(await call.getGreeting())

  await call.getBalance()
})()
