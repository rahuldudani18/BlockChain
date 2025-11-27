const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

async function main() {
  const candidates = ["Alice", "Bob", "Charlie"];
  const duration = 10; // in minutes

  const whitelist = [  //public addresses from ganache
    "0x6130C1cF416F8890DB1C0dD2B5A5B7ea60ab7Ab3", 
    "0x76B71555f82Ba01A3C90Fc8DE65eC7d9f33BD669",
    "0xD53f50Ee97E4043f87451Dc2221a2C360a5C1d18",
    "0x81524bdE79f586834ef0d555fe995c4A351131A4",
    "0x7aFbC37a657cE47d0204d3bdAe8F36305449cb07",
    "0x212c8b89C8e926f51dcea1c7A46fe4994aE18335",
    "0xC1dc2b8B93F5Cd362F832e88008268234Af1A040",
    "0x38599A3F41BeFE434144Fa5878Ca6aB3987Ef23C",
  ];

  const leafNodes = whitelist.map(addr => keccak256(addr.toLowerCase()));
  const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const merkleRoot = tree.getHexRoot();


  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(candidates, duration, merkleRoot);
  await voting.waitForDeployment();

  console.log("Contract deployed at:", await voting.getAddress());
  console.log("Merkle Root:", merkleRoot);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
