## Tech Stack

- **Smart Contracts:** Solidity  
- **Development Framework:** Hardhat  
- **Frontend:** React.js  
- **Wallet Integration:** MetaMask  
- **Blockchain Network:** Ganache CLI  
- **Merkle Tree & Hashing:** merkletreejs, keccak256  
- **Blockchain Communication:** Ethers.js  

---

## How to Run the Project

1. Clone the Repository

```
git clone https://github.com/your-username/voting-dapp.git
cd voting-dapp
```

2. Install Dependencies

```
npm init -y
npm install
npm install --save-dev hardhat
npx hardhat
npm install --save ethers
npm install --save-dev @nomicfoundation/hardhat-toolbox
```
- Then write your Voting.sol contract inside the contracts directory.

3. Compile the Smart Contract

```
npx hardhat compile
```
- After compiling, launch Ganache and connect it with MetaMask.
- Use one Ganache account’s private key in MetaMask (this account will act as the government user).

4. Deploy the Contract

```
npx hardhat run scripts/deploy.js --network ganache
```
- After deployment, copy the contract address and paste it into your constants.js file in the frontend.

5. Launch the Frontend

```
cd frontend
npm start
```