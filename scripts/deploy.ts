import { ethers } from "hardhat";

async function main() {
  const FortuneNFT = await ethers.getContractFactory("FortuneNFT");
  const fortuneNFT = await FortuneNFT.deploy();
  
  await fortuneNFT.waitForDeployment();
  
  console.log("FortuneNFT deployed to:", await fortuneNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 