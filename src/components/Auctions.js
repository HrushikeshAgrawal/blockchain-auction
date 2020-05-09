import React from "react";
import { Link } from "react-router-dom";

import LoadScreen from "./LoadScreen";
import web3 from "../ethereum/web3";

const Auctions = ({ auctionSummaries, loading }) => {
  return (
    <div>
      {loading ? (
        <LoadScreen msg={"Loading..."} />
      ) : (
        <>
          <Link to={`/newAuction`}>
            <button style={{ marginTop: "20px", marginLeft: "10px" }}>
              Create a new Auction
            </button>
          </Link>
          <h1 style={{ color: "#17a2b8", marginLeft: "10px" }}>
            Existing Auctions
          </h1>
          <div className="auctionList">
            {auctionSummaries.map(
              ({
                manager,
                itemName,
                itemImageUrl,
                minimumBid,
                biddersCount,
                status,
                deployedAddress,
              }) => (
                <div className="auction" key={deployedAddress}>
                  <Link
                    to={`/item/${deployedAddress}`}
                    style={{ color: "inherit", textDecoration: "inherit" }}
                  >
                    <h3>Owner: {manager}</h3>
                    <div className="auctionDetails">
                      <h3>Item: {itemName}</h3>
                      <h3>
                        {status ? (
                          <p className="active">Active</p>
                        ) : (
                          <p className="closed">Closed</p>
                        )}
                      </h3>
                      {/* <h3>{itemImageUrl}</h3> */}
                    </div>
                    <div className="auctionDetails">
                      <h3>
                        Minimum Bid: {web3.utils.fromWei(minimumBid, "ether")}{" "}
                        Ether
                      </h3>
                      <h3>Total Bidders: {biddersCount}</h3>
                    </div>
                  </Link>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Auctions;
