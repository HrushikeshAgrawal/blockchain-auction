import web3 from "./web3";
import factory from "./build/AuctionFactory.json";

const instance = new web3.eth.Contract(
  factory.abi,
  "Address of deployed contract"
);

export default instance;
