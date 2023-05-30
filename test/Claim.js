require("dotenv").config();
const { assert, expect } = require("chai");

const provider = new ethers.providers.JsonRpcProvider(
  `https://goerli.infura.io/v3/${process.env.ID}`
);

describe("Claim", async () => {
  let Claim, claim, owner, DemoToken, demoToken, otherAccount, wallet;
  const dailyLimit = 100;

  beforeEach(async () => {
    [owner, otherAccount, wallet] = await ethers.getSigners();

    DemoToken = await ethers.getContractFactory("DemoToken");
    demoToken = await DemoToken.deploy();

    Claim = await ethers.getContractFactory("Claim");
    claim = await Claim.deploy(demoToken.address, dailyLimit);

    // add wallet as a trusted signer
    await claim.addSigner(wallet.address);
    // transfer 10000 tokens to Claim SC
    await demoToken.connect(owner).transfer(claim.address, 10000);
  });

  it("Should claim reward", async function () {
    const amountToRedeem = dailyLimit;
    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [amountToRedeem, otherAccount.address]
    );

    const nonce = ethers.utils.randomBytes(32);

    const message = ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [data, nonce]
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(message));

    // owner is calling the Tx, but the tokens are still transferred to otherAccount, like the data says
    await claim.connect(owner).claimToken(nonce, data, signature);

    expect(await demoToken.balanceOf(otherAccount.address)).to.equal(amountToRedeem)
  });

  it("Should claim dailyLimit and 24 hours lates claim dailyLimit again", async function () {
    const amountToRedeem = dailyLimit;
    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [amountToRedeem, otherAccount.address]
    );

    const nonce = ethers.utils.randomBytes(32);

    const message = ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [data, nonce]
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(message));

    await claim.connect(otherAccount).claimToken(nonce, data, signature);

    expect(await demoToken.balanceOf(otherAccount.address)).to.equal(amountToRedeem)

    await network.provider.send("evm_increaseTime", [24 * 3600])
    await network.provider.send("evm_mine")

    const nonce2 = ethers.utils.randomBytes(32);

    const message2 = ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [data, nonce2]
    );

    const signature2 = await wallet.signMessage(ethers.utils.arrayify(message2));

    expect(await claim.connect(otherAccount).claimToken(nonce2, data, signature2)).to.changeTokenBalance(
      demoToken,
      otherAccount.address,
      amountToRedeem
    )

  });

  it("Should claim dailyLimit and revert when claim dailyLimit again", async function () {
    const amountToRedeem = dailyLimit;
    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [amountToRedeem, otherAccount.address]
    );

    const nonce = ethers.utils.randomBytes(32);

    const message = ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [data, nonce]
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(message));

    await claim.connect(otherAccount).claimToken(nonce, data, signature);

    expect(await demoToken.balanceOf(otherAccount.address)).to.equal(amountToRedeem)

    const nonce2 = ethers.utils.randomBytes(32);

    const message2 = ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [data, nonce2]
    );

    const signature2 = await wallet.signMessage(ethers.utils.arrayify(message2));
    
    await expect(claim.connect(otherAccount).claimToken(nonce2, data, signature2))
      .to.revertedWithCustomError(
        Claim,
        "Claim_Exceeded_Daily_Claiming_Limit"
      );
  });

  it("Should fail to claim reward due to invalid amount in data", async function () {
    const amountToRedeem = dailyLimit;
    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [amountToRedeem, otherAccount.address]
    );

    const fakeData = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [10 * amountToRedeem, otherAccount.address]
    );

    const nonce = ethers.utils.randomBytes(32);

    const message = ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [data, nonce]
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(message));

    await expect(
      claim.connect(otherAccount).claimToken(nonce, fakeData, signature)
    ).to.revertedWith("SignatureChecker: Invalid signature");
  });

  it("Should fail to claim reward due to invalid signer", async function () {
    const amountToRedeem = dailyLimit;
    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [amountToRedeem, otherAccount.address]
    );

    const nonce = ethers.utils.randomBytes(32);

    const message = ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [data, nonce]
    );

    const signature = await otherAccount.signMessage(ethers.utils.arrayify(message));

    await expect(
      claim.connect(otherAccount).claimToken(nonce, data, signature)
    ).to.revertedWith("SignatureChecker: Invalid signature");
  });

  it("Should fail to if amount above daily limit", async function () {
    const amountToRedeem = dailyLimit + 1;
    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [amountToRedeem, otherAccount.address]
    );

    const nonce = ethers.utils.randomBytes(32);

    const message = ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [data, nonce]
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(message));

    await expect(claim.connect(otherAccount).claimToken(nonce, data, signature))
      .to.be.revertedWithCustomError(
        Claim,
        "Claim_Exceeded_Daily_Claiming_Limit"
      );
  });

  it("Should withdraw", async function () {
    const withdrawAmount = 100;

    expect(await claim.withdrawToken(owner.address, withdrawAmount)).to.changeTokenBalance(
      demoToken,
      owner.address,
      withdrawAmount
    )
  });

  it("Should fail to withdraw", async function () {
    await expect(
      claim.connect(otherAccount).withdrawToken(owner.address, 10000)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
