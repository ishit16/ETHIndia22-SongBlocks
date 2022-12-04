import "./buttons.css";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorldIDWidget } from "@worldcoin/id";
import { useRecoilState } from "recoil";
import { WalletListState } from "../../atoms/walletAtom";

export const ConnectWalletButton = () => {
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const [worldIDProof, setWorldIDProof] = useState(null);
  const navigate = useNavigate();
  const contractAddress = "0x81d67946a26f60C94aAda17e15182bDC03440162";
  const contractABI = [
    {
      inputs: [
        {
          internalType: "contract IWorldID",
          name: "_worldId",
          type: "address",
        },
        {
          internalType: "string",
          name: "_actionId",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "InvalidNullifier",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "songId",
          type: "uint256",
        },
      ],
      name: "fileStored",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "streamer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "songOwner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "cost",
          type: "uint256",
        },
      ],
      name: "paymentSuccess",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "songid",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "message",
          type: "string",
        },
      ],
      name: "success",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_ipfsHash",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_songName",
          type: "string",
        },
        {
          internalType: "string",
          name: "_songArtist",
          type: "string",
        },
      ],
      name: "addFile",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "donate",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "getHash",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "getLikes",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getSongs",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "ipfsHash",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "songId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "songName",
              type: "string",
            },
            {
              internalType: "string",
              name: "songArtist",
              type: "string",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "bool",
              name: "isStored",
              type: "bool",
            },
          ],
          internalType: "struct Tunes.addSong[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getTotalSongs",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "likeSong",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "input",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "root",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "nullifierHash",
          type: "uint256",
        },
        {
          internalType: "uint256[8]",
          name: "proof",
          type: "uint256[8]",
        },
      ],
      name: "verifyAndExecute",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contractObject = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  );
  const signer = provider.getSigner();
  const contractWithSigner = contractObject.connect(signer);
  const claimResult = contractObject.verifyAndExecute(
    signer.getAddress(),
    worldIDProof.merkle_root,
    worldIDProof.nullifier_hash,
    abi.decode(["uint256[8]"], worldIDProof.proof)[0]
  );
  console.log(claimResult);
  console.log(worldIDProof);
  async function requestAccount() {
    console.log("Requesting Account ... ");

    if (window.ethereum) {
      console.log("detected");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
        console.log(accounts[0]);
      } catch (error) {
        console.log("Error Connecting");
      }
    } else {
      console.log("Metamask not found");
    }
  }

  async function connectWallet() {
    if (window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const network = await provider.getNetwork();
      // console.log(network.chainId);
      // console.log(network.chainId);
    }
  }

  return (
    <div>
      <button className="pushable" onClick={connectWallet}>
        <span className="shadow" />
        <span className="edge" />
        <span className="front font-bold">Connect Wallet</span>
      </button>
      <div className="widget">
        <WorldIDWidget
          actionId="wid_staging_0e62b5c9c3658ecab879e879a8601461" // obtain this from developer.worldcoin.org
          signal={walletAddress}
          enableTelemetry
          onSuccess={(proof) => setWorldIDProof(proof)}
          onError={(error) => console.error(error)}
          debug={true} // to aid with debugging, remove in production
          theme="light"
        />
      </div>
    </div>
  );
};
