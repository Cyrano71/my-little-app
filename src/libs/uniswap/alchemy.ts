// index.js
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: process.env.ALCHEMY_TOKEN,
  network: Network.ETH_MAINNET,
};

export const tokensAddress = {
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
};

export default async function getProvider() {
  const alchemy = new Alchemy(settings);
  return alchemy;
}

export async function getTokenBalances(address: string) {
  const provider = await getProvider();
  return provider.core.getTokenBalances(address);
}

export async function getBlockNumber() {
    const provider = await getProvider();
    return provider.core.getBlockNumber();
  }
