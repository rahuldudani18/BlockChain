import React from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./constants";
import { getMerkleProof, isAddressWhitelisted } from "./merkle";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMainApp: false,
      account: null,
      provider: null,
      contract: null,
      candidates: [],
      hasVoted: false,
      isGovUser: false,
      voteCounts: {},
      totalVoters: 0,
      isEligible: false,
    };
  }

  async componentDidMount() {
    if (this.state.showMainApp) {
      await this.loadBlockchainData();
    }
  }

  enterApp = async () => {
    await this.loadBlockchainData();
    this.setState({ showMainApp: true });
  };

  async loadBlockchainData() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const candidates = await contract.getCandidates();
      const hasVoted = await contract.hasVoted(account);
      const govUser = await contract.government();
      const isGovUser = govUser.toLowerCase() === account.toLowerCase();
      const isEligible = isAddressWhitelisted(account);

      this.setState({ provider, contract, account, candidates, hasVoted, isGovUser, isEligible });

      if (isGovUser) {
        const voteCounts = {};
        for (const c of candidates) {
          const count = await contract.totalVotes(c);
          voteCounts[c] = count.toString();
        }
        const totalVoters = await contract.totalVoters();
        this.setState({ voteCounts, totalVoters });
      }
    } else {
      alert("Please install MetaMask");
    }
  }

  vote = async (candidate) => {
    const { contract, account } = this.state;
    try {
      const proof = getMerkleProof(account);
      const tx = await contract.vote(candidate, proof);
      await tx.wait();
      alert("Voted successfully");
      this.setState({ hasVoted: true });
    } catch (err) {
      console.error(err);
      alert("Transaction failed — maybe you're not authorized?");
    }
  };

  render() {
    const { showMainApp, candidates, hasVoted, isGovUser, voteCounts, totalVoters, isEligible } = this.state;

    if (!showMainApp) {
      return (
        <div className="welcome-screen">
          <div className="right-box">
            <h1 className="welcome-heading">
              <span>BLOCKCHAIN</span><br />
              <span>VOTING</span><br />
              <span>SYSTEM</span>
            </h1>
            <button className="enter-btn" onClick={this.enterApp}>Enter</button>
          </div>
        </div>
      );
    }

    return (
      <div className="app">
        <h1>Blockchain Voting System</h1>

        {!isEligible ? (
          <p className="not-eligible">You are not eligible to vote.</p>
        ) : !hasVoted ? (
          <>
          <h2>Vote for your Candidate</h2>
          <div className="candidate-grid">
            {candidates.map((c, i) => (
              <div key={i} className="candidate-card">
                <img src={`/${c.toLowerCase()}.png`} alt={c} width="120" height="120" />
                <p>{c}</p>
                <button onClick={() => this.vote(c)}>Vote</button>
              </div>
            ))}
          </div>
          </>
          
        ) : (
          <p>You have already voted.</p>
        )}

        {isGovUser && (
          <div className="results">
            <h2>Final Vote Count</h2>
            <div className="vote-results-grid">
              {Object.entries(voteCounts).map(([name, count], idx) => (
                <div className="vote-card" key={idx}>
                  <p className="candidate-name">{name}</p>
                  <p className="vote-count">{count} Votes</p>
                </div>
              ))}
            </div>
            <p className="total-voters-text">Total voters: <span className="total-count">{totalVoters.toString()}</span></p>
          </div>
        )}
      </div>
    );
  }
}

export default App;
