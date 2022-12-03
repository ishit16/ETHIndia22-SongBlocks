// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Tunes{
    struct addSong{
        uint256 songId;
        string ipfsHash;
        string songMeta; 
        address owner;
        uint256 cost;
        bool isStored;
    }


    mapping(uint256 => addSong) audioFiles;  
    mapping(uint256 => uint256) songLikes;
    mapping(uint256 => uint256) songDislikes;
    // mapping(uint256 => uint256) songDownloads;

    uint songCounts;

    event fileStored(address indexed owner, uint256 indexed songId);
    // event downloaded(address indexed streamer, uint256 songId);
    event success(uint256 indexed songid, string message);
    event paymentSuccess(address indexed streamer, address indexed songOwner, uint256 cost);

    function addFile(
        uint256 _id,
        string memory _ipfsHash, 
        string memory _songMeta, 
        uint256 _cost) external returns(bool){

        require(audioFiles[_id].isStored == false, "This file already exists! copyright alert!!");

        audioFiles[_id] = addSong(_id, _ipfsHash, _songMeta, msg.sender, _cost, true);

        songCounts++;
        
        emit fileStored(msg.sender, _id);
        return true;
    }

    function donate(uint256 _id) external payable{
        address songOwner = audioFiles[_id].owner;
        payable(songOwner).transfer(msg.value);
        emit paymentSuccess(msg.sender, songOwner, msg.value);
    }

    // function getDownloads(uint256 _id) external view returns(uint256){
    //     return songDownloads[_id];
    // }

    function likeSong(uint256 _id) external{
        songLikes[_id] += 1;
        emit success(_id, "Updated likes for the song!");
    }
    
    function getLikes(uint256 _id) external view returns(uint256){
        return songLikes[_id];
    }

    function getHash(uint256 _id) external view returns(string memory){
        return audioFiles[_id].ipfsHash;
    }

    function getTotalSongs() external view returns(uint256){
        return songCounts;
    }

    function getSongs() external view returns(addSong[] memory){
        addSong[] memory ret = new addSong[](songCounts);
        for (uint i = 0; i < songCounts; i++) {
            ret[i] = audioFiles[i];
        }
        return ret;
    }

}