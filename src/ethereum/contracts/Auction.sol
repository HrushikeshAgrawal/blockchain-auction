pragma solidity ^0.6.6;


contract AuctionFactory {
    address[] public deployedAuctions;

    function createAuction(
        string memory _itemName,
        string memory _itemImageUrl,
        uint256 _minimumBid
    ) public {
        address newAuction = address(
            new Auction(_itemName, _itemImageUrl, _minimumBid, msg.sender)
        );
        deployedAuctions.push(newAuction);
    }

    function getDeployedAuctions() public view returns (address[] memory) {
        return deployedAuctions;
    }
}


contract Auction {
    address payable public manager;
    string public itemName;
    string public itemImageUrl;
    uint256 public minimumBid;
    mapping(uint256 => Bidder) public bidders;
    uint256 public biddersCount = 0;
    bool public status = true;
    Bidder public winner;

    struct Bidder {
        address payable bidder;
        uint256 bid;
    }

    modifier restricted() {
        require(msg.sender == manager, "Manager Restricted function");
        _;
    }

    constructor(
        string memory _itemName,
        string memory _itemImageUrl,
        uint256 _minimumBid,
        address payable creator
    ) public {
        manager = creator;
        itemName = _itemName;
        itemImageUrl = _itemImageUrl;
        minimumBid = _minimumBid;
    }

    function getSummary()
        public
        view
        returns (
            address payable,
            string memory,
            string memory,
            uint256,
            uint256,
            bool
        )
    {
        return (
            manager,
            itemName,
            itemImageUrl,
            minimumBid,
            biddersCount,
            status
        );
    }

    function newBid() public payable {
        require(msg.value >= minimumBid, "Bid amount insuffficient");
        require(status, "This auction is closed");
        biddersCount++;
        Bidder memory newBidder = Bidder({bidder: msg.sender, bid: msg.value});
        bidders[biddersCount] = newBidder;
    }

    function pickWinner() public payable restricted {
        require(status, "This auction is closed");
        uint256 winnerIndex = 0;
        uint256 max = 0;
        for (uint256 i = 1; i <= biddersCount; i++) {
            if (bidders[i].bid > max) {
                max = bidders[i].bid;
                winnerIndex = i;
                winner = bidders[i];
            }
        }
        manager.transfer(max);
        bidders[winnerIndex].bid = 0;
        for (uint256 i = 1; i <= biddersCount; i++) {
            bidders[i].bidder.transfer(bidders[i].bid);
        }
        status = false;
    }
}
