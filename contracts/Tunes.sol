// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Tunes{
    struct addSong{
        string ipfsHash; //unique identifier
        uint256 songId;
        string songName; 
        string songArtist;
        address owner;
        bool isStored;
    }

    mapping(uint256 => string) idHashMap;
    mapping(string => addSong) audioFiles;  
    mapping(string => uint256) songLikes;

    uint songCounts;

    event fileStored(address indexed owner, uint256 indexed songId);
    event success(uint256 indexed songid, string message);
    event paymentSuccess(address indexed streamer, address indexed songOwner, uint256 cost);

    function addFile(
        string memory _ipfsHash,
        uint256 _id,
        string memory _songName,
        string memory _songArtist
        ) external returns(bool){

        require(audioFiles[_ipfsHash].isStored == false, "This file already exists! copyright alert!!");

        audioFiles[_ipfsHash] = addSong(_ipfsHash, _id, _songName, _songArtist, msg.sender, true);
        idHashMap[_id] = _ipfsHash;
        songCounts++;
        
        emit fileStored(msg.sender, _id);
        return true;
    }

    function donate(uint256 _id) external payable{
        address songOwner = audioFiles[idHashMap[_id]].owner;
        payable(songOwner).transfer(msg.value);
        emit paymentSuccess(msg.sender, songOwner, msg.value);
    }

    function likeSong(uint256 _id) external{
        songLikes[idHashMap[_id]] += 1;
        emit success(_id, "Updated likes for the song!");
    }
    
    function getLikes(uint256 _id) external view returns(uint256){
        return songLikes[idHashMap[_id]];
    }

    function getHash(uint256 _id) public view returns(string memory){
        return audioFiles[idHashMap[_id]].ipfsHash;
    }

    function getTotalSongs() external view returns(uint256){
        return songCounts;
    }

    function getSongs() external view returns(addSong[] memory){
        addSong[] memory ret = new addSong[](songCounts);
        for (uint i = 1; i < songCounts; i++) {
            string memory songHash = getHash(i);
            ret[i] = audioFiles[songHash];
        }
        return ret;
    }

}