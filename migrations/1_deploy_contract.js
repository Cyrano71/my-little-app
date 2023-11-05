//https://docs.infura.io/tutorials/ethereum/deploy-a-contract-using-truffle

const Transactions_Contract = artifacts.require("Transactions");

module.exports = function(deployer) {
  deployer.deploy(Transactions_Contract);
};