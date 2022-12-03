const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Tunes = await hre.ethers.getContractFactory("Tunes");
  const tunes = await Tunes.deploy()

  await tunes.deployed();

  console.log(
    `Contract deployed to ${tunes.address}`
  );
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
