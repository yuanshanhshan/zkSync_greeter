import { HardhatUserConfig } from 'hardhat/config'

import '@matterlabs/hardhat-zksync-deploy'
import '@matterlabs/hardhat-zksync-solc'

import '@matterlabs/hardhat-zksync-verify'

// dynamically changes endpoints for local tests
const zkSyncTestnet =
  process.env.NODE_ENV == 'test'
    ? {
        url: 'http://localhost:3050',
        ethNetwork: 'http://localhost:8545',
        zksync: true,
      }
    : {
        url: 'https://zksync2-testnet.zksync.dev',
        ethNetwork: 'goerli',
        zksync: true,
        // contract verification endpoint
        verifyURL:
          'https://zksync2-testnet-explorer.zksync.dev/contract_verification',
      }

const config: HardhatUserConfig = {
  zksolc: {
    version: 'latest', // optional.
    // compilerSource: 'binary',
    settings: {
      //知名编译器版本信息，需要注销掉：import '@matterlabs/hardhat-zksync-solc'
      // compilerPath:
      //   'F://contractWorkspace//zksolc-bin//zksolc-windows-amd64-gnu-v1.3.14.exe',
      // experimental: {},
    },
  },
  defaultNetwork: 'zkSyncTestnet',
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.8',
        // settings: {
        //   optimizer: {
        //     enabled: true,
        //     runs: 200,
        //   },
        // },
      },
      {
        version: '0.5.16',
        // settings: {
        //   optimizer: {
        //     enabled: true,
        //     runs: 200,
        //   },
        // },
      },
    ],
  },
}

export default config
