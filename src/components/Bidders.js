import React from "react";
import Icon from "./Icon";

import web3 from "../ethereum/web3";

const Bidders = ({ bidders }) => {
  return (
    <div className="bidders">
      {bidders.length > 0 ? (
        <>
          <h1>Existing Bidders</h1>
          <table>
            <thead>
              <tr>
                <th>{""}</th>
                <th>Bidder Address</th>
                <th>Bid Amount</th>
              </tr>
            </thead>
            <tbody>
              {bidders.map(({ bidder, bid }) => (
                <tr key={bid}>
                  <td>
                    <Icon address={bidder} width={25} />
                  </td>
                  <td>{bidder}</td>
                  <td>{web3.utils.fromWei(bid, "ether")} Ether </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <h1>No Bidders Yet...</h1>
      )}
    </div>
  );
};

export default Bidders;
