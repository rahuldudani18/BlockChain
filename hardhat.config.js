require("@nomicfoundation/hardhat-toolbox");
 
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks:{
    hardhat:{
      chainId: 1337,
    },
    ganache:{
      url:process.env.GANACHE_URL,
      accounts:[
        process.env.PRIVATE_KEY //private key of gov
      ],
    }
  },
  solidity: "0.8.20",
};