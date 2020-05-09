import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import factory from "./ethereum/factory";
import Auction from "./ethereum/auction";
import web3 from "./ethereum/web3";
import Header from "./components/Header";
import Auctions from "./components/Auctions";
import AuctionItem from "./components/AuctionItem";
import NewAuction from "./components/NewAuction";

export class App extends Component {
  state = {
    userAccount: "",
    auctionAddresses: [],
    auctionSummaries: [],
    loading: true,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const auctionAddresses = await factory.methods.getDeployedAuctions().call();
    let accounts = await web3.eth.getAccounts();
    if (accounts[0] === undefined || accounts === undefined) {
      accounts = ["None. Please install metamask, log in and reload"];
    }
    console.log(accounts);
    let auctionSummaries = [];
    for (let i in auctionAddresses) {
      const tempAuction = Auction(auctionAddresses[i]);
      let summary = await tempAuction.methods.getSummary().call();
      summary = this.getFormatted(summary, auctionAddresses[i]);
      auctionSummaries.push(summary);
    }
    this.setState({
      userAccount: accounts[0],
      auctionAddresses,
      auctionSummaries,
      loading: false,
    });
  }

  getFormatted = (summary, deployedAddress) => {
    return {
      manager: summary[0],
      itemName: summary[1],
      itemImageUrl: summary[2],
      minimumBid: summary[3],
      biddersCount: summary[4],
      status: summary[5],
      deployedAddress,
    };
  };

  render() {
    const { userAccount, auctionSummaries, loading } = this.state;
    return (
      <Router>
        <div>
          <Header userAccount={userAccount} loading={loading} />
          <div className="container">
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Auctions
                    {...props}
                    loading={loading}
                    auctionSummaries={auctionSummaries}
                  />
                )}
              />
              <Route
                exact
                path="/item/:deployedAddress"
                render={(props) => (
                  <AuctionItem {...props} userAccount={userAccount} />
                )}
              />
              <Route
                exact
                path="/newAuction"
                render={(props) => (
                  <NewAuction
                    {...props}
                    factory={factory}
                    userAccount={userAccount}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
