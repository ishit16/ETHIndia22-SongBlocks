import React, { useEffect, useState } from "react";
import { ConnectWalletButton } from "../components/buttons/connectWalletButton";
import { MusicCard } from "../components/cards/musicCard";
import { useForm } from "react-cool-form";
import { PageContainer } from "../components/shared/pageContainer";
import axios from "axios";
import jsonData from "../jsonabi/tunes.json";
import { Contract, ethers, utils } from "ethers";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/shared/spinner";
import "../components/shared/shared.css";
import { useRecoilValue } from "recoil";
import { WalletListState } from "../atoms/walletAtom";

export const UserDashboard = () => {
  const isLoggedIn = useRecoilValue(WalletListState);
  const [fileImg, setFileImg] = useState(null);
  const [songName, setSongName] = useState("");
  const [singerName, setSingerName] = useState("");
  const [{ items }, setItems] = useState({ items: [] });
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [callFunction, setCallFunction] = useState(true);
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
  const getIntitalSongsList = async () => {
    const totalNumberOfSongsOnChain = await contractObject.getTotalSongs();
    const SongsData = await contractObject.getSongs();
    console.log(SongsData);
    alert(parseInt(totalNumberOfSongsOnChain));
    for (
      var i = 0;
      i <= parseInt(totalNumberOfSongsOnChain) + parseInt(1);
      i++
    ) {
      items.push(<MusicCard name={SongsData[i][2]} artist={SongsData[i][3]} />);
      setItems({ items: [...items] });
    }
  };
  if (callFunction) {
    setCallFunction(false);
    getIntitalSongsList();
  }
  console.log("Read Songs Please");
  const sendFileToIPFSAndGenerateCard = async (e) => {
    e.preventDefault();
    // const lengthOfFiles = await contractObject.getTotalSongs();
    // console.log(lengthOfFiles);
    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);
        formData.append("songName", songName);
        formData.append("SingerName", singerName);
        setSpinnerLoading(true);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `418767ee5505ef3bcbd5`,
            pinata_secret_api_key: `83b1eb5e5d59dab49dbbb9a5badb921dbf84326480070c0239163e754e98ad55`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(songName);
        console.log(singerName);
        const ImgHash = `${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        const numberOfSongs = await contractObject.getTotalSongs();
        const boolvariable = await contractWithSigner.addFile(
          ImgHash,
          parseInt(parseInt(numberOfSongs) + parseInt(1)),
          String(songName),
          String(singerName)
        );
        contractObject.on("fileStored", async (from, songID, event) => {
          console.log(parseInt(numberOfSongs));
          const uploadedSongsData = await contractObject.getSongs();
          console.log(uploadedSongsData);
          console.log(uploadedSongsData[1][3]);
          // console.log(uploadedSongsData.);
          setSpinnerLoading(false);
        });

        //Take a look at your Pinata Pinned section, you will see a new file added to you list.
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };

  return (
    <PageContainer>
      <div className="grid place-items-center p-5">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-200 mb-5">
            Songs on Chain
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{items}</div>
        </div>
        <form onSubmit={sendFileToIPFSAndGenerateCard}>
          <input
            className="text-white p-6"
            type="file"
            onChange={(e) => setFileImg(e.target.files[0])}
            required
          />
          <input
            className="text-black p-1"
            placeholder="Song Name"
            type="text"
            required
            onChange={(e) => setSongName(e.target.value)}
          ></input>

          <input
            className="ml-2 text-black p-1"
            placeholder="Singer Name"
            type="text"
            required
            onChange={(e) => setSingerName(e.target.value)}
          ></input>
          {spinnerLoading ? <LoadingSpinner /> : <></>}
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
            type="submit"
            disabled={spinnerLoading}
          >
            Upload Song
          </button>
        </form>
      </div>
    </PageContainer>
  );
};
