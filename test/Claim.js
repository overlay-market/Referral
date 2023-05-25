require("dotenv").config();

// async function signMessage(amount, address) {
//   const provider = new ethers.providers.JsonRpcProvider(
//     `https://goerli.infura.io/v3/${process.env.ID}`
//   );

//   const privateKey = process.env.TESTNET_PRIVATE_KEY;
//   const wallet = new ethers.Wallet(privateKey, provider);

// const message = ethers.utils.defaultAbiCoder.encode(
//   ["uint256", "address"],
//   [amount, address]
// );
// const messageHash = ethers.utils.hashMessage(message);

// const signature = await wallet.signMessage(
//   ethers.utils.arrayify(messageHash)
// );

//   const data = ethers.utils.defaultAbiCoder.encode(
//     ["uint256", "address"],
//     [100, otherAccount.address]
//   );
//   const nonce = ethers.utils.randomBytes(32);
//   const message = ethers.utils.concat([ethers.utils.toUtf8Bytes(data), nonce]);
//   const messageHash = ethers.utils.hashMessage(message);
//   const signature = await wallet.signMessage(
//     ethers.utils.arrayify(messageHash)
//   );

//   return { nonce, data, signature };
// }

describe("Claim", async () => {
  // before(async () => {});

  it("Should claim reward", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const provider = new ethers.providers.JsonRpcProvider(
      `https://goerli.infura.io/v3/${process.env.ID}`
    );

    const privateKey = process.env.TESTNET_PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, provider);

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
    // const { nonce, data, signature } = await signMessage(
    //   100,
    //   otherAccount.address
    // );

    await claim.connect(otherAccount).claimToken(nonce, data, signature);

    console.log(
      await demoToken.balanceOf(otherAccount.address),
      "updated balance"
    );
  });
});
