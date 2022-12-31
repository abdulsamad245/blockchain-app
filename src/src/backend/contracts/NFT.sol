pragma solidity ^0.8.4;

import  "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract NFT is ERC721URIStorage {
    uint public tokenCount;
    address owner;

    constructor() ERC721("DApp NFT", "DAPP"){
        owner = msg.sender;
    }

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }
    function getOwner() view public returns(address
    ) {
        return (owner);
    }

}
