pragma solidity ^0.8.4;

import  "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import  "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Registeritems is ReentrancyGuard {
    address payable public owner;
    uint public itemCount;

    struct registeredItem {
        uint itemId;
        IERC721 nft;
        string name;
        uint _token_id;
        uint price;
        address payable registrant;
        bool sold;
        string description;
        string location;
        string phone_address;
        string image_url;
        bool approved;
    }

    event Registered (
        uint itemId,
        address indexed nft,
        string name,
        uint _token_id,
        uint price,
        address indexed registrant,
        string description,
        string location,
        string phone,
        string _address,
        string image_url,
        string indexed documentHash


    );


    mapping (uint => registeredItem) public registeredItems;

    constructor () payable {
        // owner = msg.sender;
        owner = payable(msg.sender);

    }

    function registerItem(IERC721 _nft, string memory name, uint _token_id, uint _price, string memory description, string memory location, string memory phone, string memory _address, string memory image_url, string memory documentHash) external nonReentrant{
        require(_price > 0, "Price must be greater than zero");
     
        string memory phone_address = string(bytes.concat(bytes(phone), "[--]", bytes(_address)));
        itemCount ++;
        owner.send(_price);

        //add new item to items mapping
        registeredItems[itemCount] = registeredItem (
            itemCount,
            _nft,
            name,
            _token_id,
            _price,
            payable(msg.sender),
            false,
            description,
            location,
            phone_address,
            image_url,
            false
        );

        emit Registered(
            itemCount,
            address(_nft),
            name,
            _token_id,
            _price,
            msg.sender,
            description,
            location,
            phone, 
            _address,
            image_url,
            documentHash
           
        );
    }

    function handleApprove(uint _itemId) public returns(uint) {
        registeredItem storage item = registeredItems[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        //Update item to approved status
        if (item.approved == true) {
            item.approved = false;
            return 0;
        }else{
        item.approved = true;
        return 1;
        }

       
    }


}



