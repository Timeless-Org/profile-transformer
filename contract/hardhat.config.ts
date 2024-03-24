import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config";
import "@nomicfoundation/hardhat-verify";

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not set");
}

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://sepolia.infura.io/v3/56b9a8fd14c84c3c89927faf6ae130a8",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 11155111,
    },
    zora_sepolia: {
      url: "https://sepolia.rpc.zora.energy",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 999999999,
    },
    base_sepolia: {
      url: "https://sepolia.base.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 84532,
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 8453,
    },
  },
  etherscan: {
    apiKey: {
      base_sepolia: "5a112fff-727a-4f16-b4ff-24b4c51f832a",
    },
    customChains: [
      {
        network: "base_sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api",
          browserURL: "https://base-sepolia.blockscout.com",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
