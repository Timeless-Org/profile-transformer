import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config";

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
  },
};

export default config;
