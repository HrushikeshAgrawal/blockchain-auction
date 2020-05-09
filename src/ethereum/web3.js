import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  //  We are in the browser and metamask is running
  window.ethereum.enable();
  web3 = new Web3(window.web3.currentProvider);
} else {
  //  We are on the server OR user is not running metamax
  const provider = new Web3.providers.HttpProvider("rinkeby link from infura");
  web3 = new Web3(provider);
}

export default web3;
