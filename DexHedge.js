const ethers = require("ethers");
const fs = require("fs");

class DexHedge {

    /**
     * 构造函数
     * @param privateKey        钱包私钥
     * @param rpc               区块链节点RPC
     * @param batPairReserves   "批量获取流动性"合约地址
     * @param dexHedge          "对冲"合约地址
     */
    constructor(privateKey, rpc, batPairReserves, dexHedge) {
        this.provider = new ethers.providers.JsonRpcProvider(rpc);

        this.wallet = new ethers.Wallet(privateKey, this.provider);

        let data = JSON.parse(fs.readFileSync('./abi/BatPairReserves.json', {encoding: "UTF-8"}));
        this.batPairReserves = new ethers.Contract(batPairReserves, data.abi, this.provider);

        data = JSON.parse(fs.readFileSync('./abi/DexHedge.json', {encoding: "UTF-8"}));
        this.dexHedge = new ethers.Contract(dexHedge, data.abi, this.wallet);
    }

    /**
     * 获得Token对象
     * @param tokenAddr     ERC20地址
     * @returns {Contract}  ERC20对象
     */
    getERC20Contract(tokenAddr) {
        let data = JSON.parse(fs.readFileSync('./abi/ERC20.json', {encoding: "UTF-8"}));
        return new ethers.Contract(tokenAddr, data.abi, this.provider);
    }

    /**
     * 获得accout的Token余额
     * @param tokenAddr         Token地址
     * @param account           账号
     * @returns {Promise<*>}    余额
     */
    async tokenBalanceOf(tokenAddr, account) {
        let erc20 = this.getERC20Contract(tokenAddr);
        return await erc20.balanceOf(account);
    }

    /**
     * 获得Token精度
     * @param tokenAddr         Token地址
     * @returns {Promise<*>}    精度
     */
    async tokenDecimals(tokenAddr) {
        let erc20 = this.getERC20Contract(tokenAddr);
        return await erc20.decimals();
    }

    /**
     * 批量获得交易对的reserves(流动资金量)
     * @param tokenArr          Token数组，长度必须是2的倍数，每2个Token决定一个交易对
     * @returns {Promise<*>}    交易对对应Token的流动资金量
     */
    async getBatPairReserves(tokenArr) {
        return await this.batPairReserves.getBatPairReserves(tokenArr);
    }

    /**
     * 对冲交易
     * @param dexId             去中心化交易所id（当前只有0）
     * @param amountIn          兑换本金Token数量
     * @param amountOutMin      最少得到目的Token数量
     * @param path              兑换路径
     * @param deadline          有效截止时间戳
     * @returns {Promise<*>}    对冲Tx, Tx.hash表示txid
     */
    async hedgeSwap(dexId, amountIn, amountOutMin, path, deadline) {
        return await this.dexHedge.swap(dexId, amountIn, amountOutMin, path, deadline);
    }

    /**
     * 获得指定账号的nonce
     * @param account           指定账号
     * @returns {Promise<*>}    下一个tx的nonce
     */
    async getNonce(account) {
        return await this.provider.getTransactionCount(account);
    }
    
}

module.exports = DexHedge;