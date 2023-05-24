require("dotenv").config();

async function signMessage() {
  const provider = new ethers.providers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${process.env.ID}`
  );

  const privateKey = process.env.TESTNET_PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);

  const message = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("OVL_SIGNER"));
  const messageHash = ethers.utils.hashMessage(message);

  const signature = await wallet.signMessage(
    ethers.utils.arrayify(messageHash)
  );

  return { messageHash, signature };
}

describe("Claim", async () => {
  it("Should claim reward", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const DemoToken = await ethers.getContractFactory("DemoToken");
    const demoToken = await DemoToken.deploy();

    const Claim = await ethers.getContractFactory("Claim");
    const claim = await Claim.deploy(demoToken.address);

    const hash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("SIGNER_ROLE")
    );

    await claim.grantNewRole(
      "0x6f71f4f0a8628e2f99325309456a096b502a4dd4",
      hash
    );

    await demoToken.connect(owner).transfer(claim.address, 10000);

    console.log(await demoToken.balanceOf(otherAccount.address));
    const { messageHash, signature } = await signMessage();

    await claim
      .connect(otherAccount)
      .claimToken(100, otherAccount.address, messageHash, signature);

    console.log(
      await demoToken.balanceOf(otherAccount.address),
      "updated balance"
    );
  });
});
