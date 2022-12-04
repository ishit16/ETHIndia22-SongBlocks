import "./containers.css";
import { useState } from "react";
import { ethers } from "ethers";
import { Header } from "../shared/header";
import { Footer } from "../shared/footer";
import Sparkles from "../sparkle/generateSparkle";
import { ConnectWalletButton } from "../buttons/connectWalletButton";
import { WorldIDWidget } from "@worldcoin/id";
export const WalletContainer = () => {
  return (
    // <Sparkles>
    <div className="flex flex-col items-center justify-center m-auto max-w-xs p-8 connect-wallet-colors rounded-lg">
      <h1 className="crypto-colors text-3xl text-center pb-6">
        Connect your Crypto Wallet!
      </h1>
      <ConnectWalletButton />
      <p className="pt-6 text-center crypto-colors">
        By logging in your wallet you agree to give us access to your account
        number
      </p>
    </div>
    // </Sparkles>
  );
};
