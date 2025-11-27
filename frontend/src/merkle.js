import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

// Make sure Buffer is available globally
import { Buffer } from "buffer";
window.Buffer = Buffer;

// Whitelist of authorized addresses
const whitelist = [
  "0x6130C1cF416F8890DB1C0dD2B5A5B7ea60ab7Ab3",
  "0x76B71555f82Ba01A3C90Fc8DE65eC7d9f33BD669",
  "0xD53f50Ee97E4043f87451Dc2221a2C360a5C1d18",
  "0x81524bdE79f586834ef0d555fe995c4A351131A4",
  "0x7aFbC37a657cE47d0204d3bdAe8F36305449cb07",
  "0x212c8b89C8e926f51dcea1c7A46fe4994aE18335",
  "0xC1dc2b8B93F5Cd362F832e88008268234Af1A040",
  "0x38599A3F41BeFE434144Fa5878Ca6aB3987Ef23C",
];

// Generate leaf nodes using lowercase address and keccak256 hashing
const leafNodes = whitelist.map((addr) => keccak256(addr.toLowerCase()));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

export const getMerkleProof = (address) => {
  const leaf = keccak256(address.toLowerCase());
  return merkleTree.getHexProof(leaf);
};

export const isAddressWhitelisted = (address) => {
  const leaf = keccak256(address.toLowerCase());
  return merkleTree.getLeafIndex(leaf) !== -1;
};
