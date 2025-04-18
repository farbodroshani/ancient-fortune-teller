import { ethers } from 'ethers';
import { Fortune } from '../types';
import FortuneNFT from '../contracts/FortuneNFT.json';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export class Web3Service {
  private provider: ethers.BrowserProvider;
  private contract: ethers.Contract;
  
  constructor(contractAddress: string) {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.contract = new ethers.Contract(
      contractAddress,
      FortuneNFT.abi,
      this.provider
    );
  }
  
  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      return accounts[0];
    } catch (error) {
      throw new Error('Failed to connect wallet');
    }
  }
  
  async mintFortuneNFT(fortune: Fortune, address: string): Promise<string> {
    const metadata = this.createNFTMetadata(fortune);
    const tokenURI = await this.uploadToIPFS(metadata);
    
    const signer = await this.provider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    
    const tx = await (contractWithSigner as any).mintFortune(
      address,
      tokenURI,
      this.hashFortune(fortune)
    );
    
    return tx.hash;
  }
  
  private createNFTMetadata(fortune: Fortune): NFTMetadata {
    return {
      name: `Fortune #${fortune.id}`,
      description: fortune.interpretation,
      image: `ipfs://${fortune.id}`, // Store card image on IPFS
      attributes: [
        {
          trait_type: 'Category',
          value: fortune.category
        },
        {
          trait_type: 'Chinese Text',
          value: fortune.chinese
        },
        {
          trait_type: 'English Text',
          value: fortune.english
        }
      ]
    };
  }
  
  private hashFortune(fortune: Fortune): string {
    return ethers.keccak256(
      ethers.toUtf8Bytes(
        `${fortune.id}${fortune.chinese}${fortune.english}${fortune.interpretation}`
      )
    );
  }
  
  private async uploadToIPFS(metadata: NFTMetadata): Promise<string> {
    // In a real implementation, you would upload to IPFS here
    // For now, we'll return a placeholder
    return `ipfs://${ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(metadata)))}`;
  }
} 