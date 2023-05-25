require("dotenv").config();
const { assert, expect } = require("chai");

const provider = new ethers.providers.JsonRpcProvider(
  `https://goerli.infura.io/v3/${process.env.ID}`
);

const privateKey = process.env.TESTNET_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

describe("Claim", async () => {
  let Claim, claim, owner, DemoToken, demoToken, otherAccount;

  beforeEach(async () => {
    [owner, otherAccount] = await ethers.getSigners();

    DemoToken = await ethers.getContractFactory("DemoToken");
    demoToken = await DemoToken.deploy();

    Claim = await ethers.getContractFactory("Claim");
    claim = await Claim.deploy(demoToken.address, 100);

    await claim.addSigner("0x6f71f4f0a8628e2f99325309456a096b502a4dd4");
  });

  it("Should claim reward", async function () {
    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [100, otherAccount.address]
    );

    const nonce = ethers.utils.randomBytes(32);

    const message = ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [data, nonce]
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(message));

    const DemoToken = await ethers.getContractFactory("DemoToken");
    const demoToken = await DemoToken.deploy();

    const Claim = await ethers.getContractFactory("Claim");
    const claim = await Claim.deploy(demoToken.address, 100);

    await claim.addSigner("0x6f71f4f0a8628e2f99325309456a096b502a4dd4");
    await demoToken.connect(owner).transfer(claim.address, 10000);

    console.log(await demoToken.balanceOf(otherAccount.address));

    await claim.connect(otherAccount).claimToken(nonce, data, signature);

    console.log(
      await demoToken.balanceOf(otherAccount.address),
      "updated balance"
    );
  });

  it("Should fail to claim reward due to invalid signature", async function () {
    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [100, otherAccount.address]
    );

    const fakeDate = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [1000, otherAccount.address]
    );

    const nonce = ethers.utils.randomBytes(32);

    const message = ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [data, nonce]
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(message));

    await expect(
      claim.connect(otherAccount).claimToken(nonce, fakeDate, signature)
    ).to.revertedWith("SignatureChecker: Invalid signature");
  });

  it("Should fail to if amount above daily limit", async function () {
    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [1000, otherAccount.address]
    );

    const nonce = ethers.utils.randomBytes(32);

    const message = ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [data, nonce]
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(message));

    await expect(claim.connect(otherAccount).claimToken(nonce, data, signature))
      .to.be.reverted;
  });

  it("Should withdraw", async function () {
    claim.withdrawToken(owner.address, 10000);
  });

  it("Should fail to withdraw", async function () {
    await expect(
      claim.connect(otherAccount).withdrawToken(owner.address, 10000)
    ).to.be.reverted;
  });
});
