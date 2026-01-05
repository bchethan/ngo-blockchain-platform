const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NGO Blockchain Platform", function () {
  let NGORegistry, DonationManager, ExpenditureTracker;
  let ngoRegistry, donationManager, expenditureTracker;
  let owner, ngo, donor, otherAccount;

  beforeEach(async function () {
    [owner, ngo, donor, otherAccount] = await ethers.getSigners();

    NGORegistry = await ethers.getContractFactory("NGORegistry");
    ngoRegistry = await NGORegistry.deploy();

    DonationManager = await ethers.getContractFactory("DonationManager");
    donationManager = await DonationManager.deploy(await ngoRegistry.getAddress());

    ExpenditureTracker = await ethers.getContractFactory("ExpenditureTracker");
    expenditureTracker = await ExpenditureTracker.deploy(await ngoRegistry.getAddress());
  });

  describe("NGORegistry", function () {
    it("Should register an NGO", async function () {
      await ngoRegistry.connect(ngo).registerNGO("Save The World", "REG123", "Helping people", "QmHash123");
      const ngoData = await ngoRegistry.getNGO(ngo.address);
      expect(ngoData.name).to.equal("Save The World");
      expect(ngoData.isVerified).to.equal(false);
    });

    it("Should verify an NGO by Admin", async function () {
      await ngoRegistry.connect(ngo).registerNGO("Save The World", "REG123", "Helping people", "QmHash123");
      await ngoRegistry.connect(owner).verifyNGO(ngo.address);
      const ngoData = await ngoRegistry.getNGO(ngo.address);
      expect(ngoData.isVerified).to.equal(true);
    });
  });

  describe("DonationManager", function () {
    it("Should fail donation if NGO is not verified", async function () {
      await ngoRegistry.connect(ngo).registerNGO("Save The World", "REG123", "Helping people", "QmHash123");
      await expect(
        donationManager.connect(donor).donate(ngo.address, "Great work", { value: ethers.parseEther("1.0") })
      ).to.be.revertedWith("NGO is not verified");
    });

    it("Should accept donation for verified NGO", async function () {
      await ngoRegistry.connect(ngo).registerNGO("Save The World", "REG123", "Helping people", "QmHash123");
      await ngoRegistry.connect(owner).verifyNGO(ngo.address);

      await donationManager.connect(donor).donate(ngo.address, "Great work", { value: ethers.parseEther("1.0") });
      
      const donations = await donationManager.getDonationsByDonor(donor.address);
      expect(donations.length).to.equal(1);
      expect(donations[0].amount).to.equal(ethers.parseEther("1.0"));
    });
  });

  describe("ExpenditureTracker", function () {
    it("Should record expenditure by verified NGO", async function () {
      await ngoRegistry.connect(ngo).registerNGO("Save The World", "REG123", "Helping people", "QmHash123");
      await ngoRegistry.connect(owner).verifyNGO(ngo.address);

      await expenditureTracker.connect(ngo).recordExpenditure(ethers.parseEther("0.5"), "Vendor A", "Food supplies", "QmHashReceipt");
      
      const expenditures = await expenditureTracker.getExpendituresByNGO(ngo.address);
      expect(expenditures.length).to.equal(1);
      expect(expenditures[0].amount).to.equal(ethers.parseEther("0.5"));
    });
    
     it("Should fail if unverified NGO tries to record", async function () {
      await ngoRegistry.connect(ngo).registerNGO("Save The World", "REG123", "Helping people", "QmHash123");
      // Not verified

       await expect(
        expenditureTracker.connect(ngo).recordExpenditure(ethers.parseEther("0.5"), "Vendor A", "Food supplies", "QmHashReceipt")
      ).to.be.revertedWith("Only verified NGOs can record expenditures");
    });
  });
});
