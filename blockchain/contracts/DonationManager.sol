// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./NGORegistry.sol";

contract DonationManager {
    NGORegistry public ngoRegistry;

    struct Donation {
        address donor;
        address ngo;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    Donation[] public allDonations;
    mapping(address => uint256[]) public donorDonations; // Indices of donations
    mapping(address => uint256[]) public ngoDonations;   // Indices of donations

    event DonationReceived(address indexed donor, address indexed ngo, uint256 amount, uint256 timestamp);

    constructor(address _ngoRegistryAddress) {
        ngoRegistry = NGORegistry(_ngoRegistryAddress);
    }

    function donate(address _ngoAddress, string memory _message) external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(ngoRegistry.isVerified(_ngoAddress), "NGO is not verified");

        // Transfer funds to NGO
        (bool sent, ) = _ngoAddress.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        // Record donation
        Donation memory newDonation = Donation({
            donor: msg.sender,
            ngo: _ngoAddress,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        });

        allDonations.push(newDonation);
        uint256 donationId = allDonations.length - 1;
        
        donorDonations[msg.sender].push(donationId);
        ngoDonations[_ngoAddress].push(donationId);

        emit DonationReceived(msg.sender, _ngoAddress, msg.value, block.timestamp);
    }

    function getDonationsByDonor(address _donor) external view returns (Donation[] memory) {
        uint256[] memory ids = donorDonations[_donor];
        Donation[] memory result = new Donation[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            result[i] = allDonations[ids[i]];
        }
        return result;
    }

    function getDonationsByNGO(address _ngo) external view returns (Donation[] memory) {
        uint256[] memory ids = ngoDonations[_ngo];
        Donation[] memory result = new Donation[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            result[i] = allDonations[ids[i]];
        }
        return result;
    }

    function getAllDonations() external view returns (Donation[] memory) {
        return allDonations;
    }
}
