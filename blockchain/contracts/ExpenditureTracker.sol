// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./NGORegistry.sol";

contract ExpenditureTracker {
    NGORegistry public ngoRegistry;

    struct Expenditure {
        address ngo;
        uint256 amount;
        string recipient;
        string description;
        uint256 timestamp;
        string ipfsReceiptHash; // IPFS hash for receipt image/doc
    }

    mapping(address => Expenditure[]) public ngoExpenditures;

    event ExpenditureRecorded(address indexed ngo, uint256 amount, string recipient, uint256 timestamp);

    constructor(address _ngoRegistryAddress) {
        ngoRegistry = NGORegistry(_ngoRegistryAddress);
    }

    function recordExpenditure(
        uint256 _amount,
        string memory _recipient,
        string memory _description,
        string memory _ipfsReceiptHash
    ) external {
        require(ngoRegistry.isVerified(msg.sender), "Only verified NGOs can record expenditures");

        Expenditure memory newExpenditure = Expenditure({
            ngo: msg.sender,
            amount: _amount,
            recipient: _recipient,
            description: _description,
            timestamp: block.timestamp,
            ipfsReceiptHash: _ipfsReceiptHash
        });

        ngoExpenditures[msg.sender].push(newExpenditure);
        emit ExpenditureRecorded(msg.sender, _amount, _recipient, block.timestamp);
    }

    function getExpendituresByNGO(address _ngo) external view returns (Expenditure[] memory) {
        return ngoExpenditures[_ngo];
    }
}
