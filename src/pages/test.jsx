import { useState } from "react";
import axios from "axios";
export const Test = () => {
  const [fileImg, setFileImg] = useState(null);

  const sendFileToIPFS = async (e) => {
    e.preventDefault();
    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);

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

        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        //Take a look at your Pinata Pinned section, you will see a new file added to you list.
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };

  return (
    <>
      <form onSubmit={sendFileToIPFS}>
        <input
          type="file"
          onChange={(e) => setFileImg(e.target.files[0])}
          required
        />
        <button type="submit">Mint NFT</button>
      </form>
    </>
  );
};
