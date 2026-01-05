require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/KEY", // Placeholder
      accounts: [] // Placeholder
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337
    }
  }
};
