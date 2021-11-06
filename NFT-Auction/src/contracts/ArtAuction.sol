pragma solidity >=0.4.21 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ArtAuction is ERC721{
    using SafeMath for uint256;

    struct ArtItem{
        address payable seller;
        uint256 minbid;
        string tokenURI;
        bool exists;
        uint bidIncrement;
    }
    struct bidding{
        uint highestBidingBid;
        address payable highestBidder;
    }

    address public owner;
    uint256 public _tokenIDs;
    uint256 public _artItemIDs;
    bool public canceled;
    mapping(uint256=>ArtItem)private _artItems;
    mapping(uint256=>mapping(address => uint256)) public fundsByBidder;
    mapping(uint256=>bidding)public bid;
    bool auctionStarted=false;
    bool firstBid =false;

    event LogBid(address bidder,uint bid,address highestBidder,uint highestBid,uint highestBidingBid);
    event LogWithdrawal(address withdrawer,address withdrawalAccount,uint amount);
    event LogCanceled();

    constructor()public ERC721("DART","ART"){
        owner=msg.sender;
    }

    function addArtItem(uint256 price,string memory tokenURI,uint _bidincrement)public{
        require(price>0,"价格必须大于0");
        _artItemIDs++;
        _artItems[_artItemIDs]=ArtItem(msg.sender,price,tokenURI,true,_bidincrement);
    }

    function getArtItem(uint256 id)public view returns(uint256,uint256,string memory,uint256){
        require(_artItems[id].exists,"Not Found");
        ArtItem memory artitem=_artItems[id];
        bidding memory bids=bid[id];
        return (id,artitem.minbid,artitem.tokenURI,bids.highestBidingBid);
    }

    function cancelAuction(uint256 id)public payable returns(bool success){
        require(_artItems[id].seller!=msg.sender);
        require(canceled==false);
        canceled=true;
        if(auctionStarted==true){
            ArtItem memory artitme = _artItems[id];
            bidding storage bids =bid[id];
            _tokenIDs++;
            _safeMint(msg.sender,_tokenIDs);
            _setTokenURI(_tokenIDs,artitme.tokenURI);

            require(bids.highestBidingBid>0);
            fundsByBidder[id][bids.highestBidder]-=bids.highestBidingBid;
            require(msg.sender.send(bids.highestBidingBid));
        }
        LogCanceled();
        return true;
    }
    function placeBid(uint256 id)public payable returns(bool success){
        require(_artItems[id].seller!=msg.sender);
        require(canceled==false);
        require(msg.value>_artItems[id].minbid);
        bidding storage bids=bid[id];
        ArtItem memory artitem=_artItems[id];
        auctionStarted=true;

        uint newBid=fundsByBidder[id][msg.sender]+msg.value;
        require(newBid>bids.highestBidingBid);

        uint highestBid=fundsByBidder[id][bids.highestBidder];
        if(newBid<=highestBid){
            if(newBid+artitem.bidIncrement>highestBid){
                bids.highestBidingBid=highestBid;
            }
            else{
                bids.highestBidingBid=newBid+artitem.bidIncrement;
            }
        }
        else{
            if(msg.sender!=bids.highestBidder){
                bids.highestBidder=msg.sender;
                if(newBid+artitem.bidIncrement>highestBid){
                    if(firstBid==false){
                        bids.highestBidingBid=highestBid;
                    }
                    else{
                        bids.highestBidingBid=artitem.minbid+artitem.bidIncrement;
                        firstBid=true;
                    }
                }
                else{
                    bids.highestBidingBid=newBid+artitem.bidIncrement;
                }
            }
            highestBid=newBid;
        }
        LogBid(msg.sender, newBid, bids.highestBidder,highestBid, bids.highestBidingBid);
        return true;
    }

    function withdraw(uint256 id)public payable returns(bool success){
        require(_artItems[id].seller!=msg.sender);
        require(canceled==true);
        require(auctionStarted==true);
        address payable withdrawalAccount;
        uint withdrawalAmount;
        bidding storage bids=bid[id];
        if(msg.sender==bids.highestBidder){
            withdrawalAccount=bids.highestBidder;
            withdrawalAmount=fundsByBidder[id][bids.highestBidder];
        }
        else{
            withdrawalAccount=msg.sender;
            withdrawalAmount=fundsByBidder[id][withdrawalAccount];
        }
        
        require(withdrawalAmount!=0);
        fundsByBidder[id][withdrawalAccount] -= withdrawalAmount;
        require(msg.sender.send(withdrawalAmount));
        LogWithdrawal(msg.sender, withdrawalAccount, withdrawalAmount);
        return true;
    }

}