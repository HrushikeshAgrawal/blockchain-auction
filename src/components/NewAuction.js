import React, { useState } from "react";
import { Link } from "react-router-dom";

import web3 from "../ethereum/web3";

import LoadScreen from "./LoadScreen";
import ErrorBar from "./ErrorBar";

const NewAuction = ({ factory, userAccount, history }) => {
  const [item, setItem] = useState("");
  const [url, setUrl] = useState("");
  const [minBid, setMinBid] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMessage, setLoadMessage] = useState("Loading...");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const minBidInt = parseInt(minBid);
    if (item === "" || isNaN(minBidInt)) {
      makeError(`Please enter Item Name and Minimum Bid`);
      return;
    }
    setLoadMessage("Processing Transaction...");
    setLoading(true);
    try {
      await factory.methods
        .createAuction(item, url, web3.utils.toWei(minBid, "ether"))
        .send({ from: userAccount })
        .once("receipt", (receipt) => {
          history.push("/");
          window.location.reload();
        });
    } catch (err) {
      setLoadMessage("Loading...");
      setLoading(false);
      if (
        err.message ===
        `Provided address "None. Please install metamask, log in and reload" is invalid, the capitalization checksum test failed, or its an indrect IBAN address which can't be converted.`
      )
        makeError(
          "No account detected. Please install metamask, log in and reload..."
        );
      else makeError(err.message);
    }
  };

  const makeError = async (msg) => {
    setError(msg);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  return (
    <div className="newAuction">
      <ErrorBar error={error} />
      <>
        {loading ? (
          <LoadScreen msg={loadMessage} />
        ) : (
          <>
            <Link to={`/`}>
              <button style={{ marginTop: "20px" }}>
                Back to all auctions
              </button>
            </Link>
            <h1 style={{ color: "#17a2b8" }}>New Auction</h1>
            <form onSubmit={onSubmit}>
              <div className="row">
                <label>Name of the Item : </label>
                <input
                  type="text"
                  name="item"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                />
              </div>
              <div className="row">
                <label>Image URL (optional) : </label>
                <input
                  type="text"
                  name="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="row">
                <label>Minimum Bid Amount in Ether : </label>
                <input
                  type="text"
                  name="minBid"
                  value={minBid}
                  onChange={(e) => setMinBid(e.target.value)}
                />
              </div>
              <button style={{ marginTop: "20px" }}>Submit</button>
            </form>
          </>
        )}
      </>
    </div>
  );
};

export default NewAuction;
