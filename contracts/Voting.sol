// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Voting {
    address public government;
    string[] public candidates;
    uint public deadline;
    bytes32 public merkleRoot;

    mapping(string => uint) public totalVotes;
    mapping(address => bool) public hasVoted;
    uint public totalVoters;

    constructor(
        string[] memory _candidates,
        uint _durationMinutes,
        bytes32 _merkleRoot
    ) {
        government = msg.sender;
        candidates = _candidates;
        deadline = block.timestamp + (_durationMinutes * 1 minutes);
        merkleRoot = _merkleRoot;
    }

    function vote(string memory _candidate, bytes32[] calldata _merkleProof) public {
        require(block.timestamp <= deadline, "Voting period is over");
        require(!hasVoted[msg.sender], "You have already voted");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(
            MerkleProof.verify(_merkleProof, merkleRoot, leaf),
            "Invalid proof: You are not authorized"
        );

        totalVotes[_candidate]++;
        hasVoted[msg.sender] = true;
        totalVoters++;
    }

    function getCandidates() public view returns (string[] memory) {
        return candidates;
    }

    function hasVotedStatus(address _addr) public view returns (bool) {
        return hasVoted[_addr];
    }

    function isGov(address _addr) public view returns (bool) {
        return _addr == government;
    }
}
