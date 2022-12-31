pragma solidity ^0.8.4;

import  "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import  "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
    address owner;
    address payable public immutable feeAccount;
    uint public immutable feePercent;
    uint public itemCount;

    struct saleItem {
        uint itemId;
        IERC721 nft;
        string name;
        uint _token_id;
        uint price;
        address payable seller;
        bool sold;
        bool approved;
        string location;
        string phone;
        string _address;
        string image_url;

    }

    event Offered (
        uint itemId,
        address indexed nft,
        string name,
        uint _token_id,
        uint price,
        address indexed seller,
        string description,
        string indexed documentHash
    );

    event Bought (
        uint itemId,
        address indexed nft,
        uint _token_id,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    mapping (uint => saleItem) public saleItems;


    constructor (uint _feePercent) {
        owner = msg.sender;
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function sellItem(IERC721 _nft, string memory name, uint _token_id, uint _price, string memory description, string memory location, string memory phone, string memory _address, string memory image_url, string memory documentHash) external nonReentrant{
        require(_price > 0, "Price must be greater than zero");

        itemCount ++;
        
        //transfer nft
        _nft.transferFrom(msg.sender, address(this), _token_id);

        //add new item to items mapping
        saleItems[itemCount] = saleItem (
            itemCount,
            _nft,
            name,
            _token_id,
            _price,
            payable(msg.sender),
            false,
            false,
            location,
            phone,
            _address,
            image_url
        );

        emit Offered(
            itemCount,
            address(_nft),
            name,
            _token_id,
            _price,
            msg.sender,
            description,
            documentHash
    
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        saleItem storage item = saleItems[_itemId];
        // console.log(item);

        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");

        //Pay seller and fee account
        item.seller.transfer(item.price);
        // payable(0x70997970C51812dc3A010C7d01b50e0d17dc79C8).transfer(item.price);
        // item.price = 838383838;
        feeAccount.transfer(_totalPrice - item.price);

        //Update item to sold
        item.sold = true;

        //Transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item._token_id);

        emit Bought(
            _itemId,
            address(item.nft),
            item._token_id,
            item.price, 
            item.seller,
            msg.sender
        );

       
    }
    function handleApprove(uint _itemId) public returns(uint){
        saleItem storage item = saleItems[_itemId];
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
       
    function getTotalPrice(uint _itemId) view public returns(uint) {
        return(saleItems[_itemId].price*(100 + feePercent)/100);
    }

    function getOwner() view public returns(address
    ) {
        return (owner);
    }
}



