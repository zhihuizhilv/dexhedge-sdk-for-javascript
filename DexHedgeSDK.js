const ethers = require("ethers");
const fs = require("fs");

class DexHedgeSDK {

    constructor(privateKey, rpc, batPairReserves, dexHedge) {
        this.provider = new ethers.providers.JsonRpcProvider(rpc);

        this.wallet = new ethers.Wallet(privateKey, this.provider);

        let data = JSON.parse(fs.readFileSync('./abi/BatPairReserves.json', {encoding: "UTF-8"}));
        this.batPairReserves = new ethers.Contract(batPairReserves, data.abi, this.provider);

        data = JSON.parse(fs.readFileSync('./abi/DexHedge.json', {encoding: "UTF-8"}));
        this.dexHedge = new ethers.Contract(dexHedge, data.abi, this.wallet);
    }

    getERC20Contract(tokenAddr) {
        let data = JSON.parse(fs.readFileSync('./abi/ERC20.json', {encoding: "UTF-8"}));
        return new ethers.Contract(tokenAddr, data.abi, this.provider);
    }

    async tokenBalanceOf(tokenAddr, account) {
        let erc20 = this.getERC20Contract(tokenAddr);
        return await erc20.balanceOf(account);
    }

    async tokenDecimals(tokenAddr) {
        let erc20 = this.getERC20Contract(tokenAddr);
        return await erc20.decimals();
    }

    async getBatPairReserves(tokenArr) {
        return await this.batPairReserves.getBatPairReserves(tokenArr);
    }

    async hedgeSwap(dexId, amountIn, amountOutMin, path, deadline) {
        return await this.dexHedge.swap(dexId, amountIn, amountOutMin, path, deadline);
    }
    
}

module.exports = DexHedgeSDK;