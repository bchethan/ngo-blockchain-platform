const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy NGORegistry
  const NGORegistry = await hre.ethers.getContractFactory("NGORegistry");
  const ngoRegistry = await NGORegistry.deploy();
  await ngoRegistry.waitForDeployment();
  console.log("NGORegistry deployed to:", await ngoRegistry.getAddress());

  const ngoRegistryAddress = await ngoRegistry.getAddress();

  // Deploy DonationManager
  const DonationManager = await hre.ethers.getContractFactory("DonationManager");
  const donationManager = await DonationManager.deploy(ngoRegistryAddress);
  await donationManager.waitForDeployment();
  console.log("DonationManager deployed to:", await donationManager.getAddress());

  // Deploy ExpenditureTracker
  const ExpenditureTracker = await hre.ethers.getContractFactory("ExpenditureTracker");
  const expenditureTracker = await ExpenditureTracker.deploy(ngoRegistryAddress);
  await expenditureTracker.waitForDeployment();
  console.log("ExpenditureTracker deployed to:", await expenditureTracker.getAddress());
  
  // Save addresses to file for frontend/backend to use
  const fs = require("fs");
  const addresses = {
    NGORegistry: ngoRegistryAddress,
    DonationManager: await donationManager.getAddress(),
    ExpenditureTracker: await expenditureTracker.getAddress(),
  };

  const path = require("path");
  // Save to frontend src (we will create this directory structure later if not exists, but we did create it)
  // Also save to backend src/config
  const frontendDir = path.join(__dirname, "../../frontend/src");
  const backendDir = path.join(__dirname, "../../backend/src/config");

  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }
  if (!fs.existsSync(backendDir)) {
      fs.mkdirSync(backendDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendDir, "contract-addresses.json"),
    JSON.stringify(addresses, null, 2)
  );
  fs.writeFileSync(
    path.join(backendDir, "contract-addresses.json"),
    JSON.stringify(addresses, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
