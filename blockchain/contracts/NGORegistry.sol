// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract NGORegistry {
    struct NGO {
        string name;
        string registrationId;
        string description;
        address walletAddress;
        bool isVerified;
        string ipfsDocHash; // IPFS hash for verification documents
    }

    address public admin;
    mapping(address => NGO) public ngos;
    address[] public ngoAddresses;

    event NGORegistered(address indexed ngoAddress, string name);
    event NGOVerified(address indexed ngoAddress);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegistered() {
        require(bytes(ngos[msg.sender].name).length > 0, "NGO not registered");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerNGO(
        string memory _name,
        string memory _registrationId,
        string memory _description,
        string memory _ipfsDocHash
    ) external {
        require(bytes(ngos[msg.sender].name).length == 0, "NGO already registered");

        ngos[msg.sender] = NGO({
            name: _name,
            registrationId: _registrationId,
            description: _description,
            walletAddress: msg.sender,
            isVerified: false,
            ipfsDocHash: _ipfsDocHash
        });

        ngoAddresses.push(msg.sender);
        emit NGORegistered(msg.sender, _name);
    }

    function verifyNGO(address _ngoAddress) external onlyAdmin {
        require(bytes(ngos[_ngoAddress].name).length > 0, "NGO does not exist");
        require(!ngos[_ngoAddress].isVerified, "NGO already verified");

        ngos[_ngoAddress].isVerified = true;
        emit NGOVerified(_ngoAddress);
    }

    function getNGO(address _ngoAddress) external view returns (NGO memory) {
        return ngos[_ngoAddress];
    }

    function getAllNGOs() external view returns (NGO[] memory) {
        NGO[] memory allNgos = new NGO[](ngoAddresses.length);
        for (uint i = 0; i < ngoAddresses.length; i++) {
            allNgos[i] = ngos[ngoAddresses[i]];
        }
        return allNgos;
    }

    function isVerified(address _ngoAddress) external view returns (bool) {
        return ngos[_ngoAddress].isVerified;
    }
}
