let DexHedge = require("./DexHedge");
const ethers = require("ethers");

async function main() {
    console.log("main");
    let dexHege = new DexHedge(process.env.privateKey,
        "https://data-seed-prebsc-1-s1.binance.org:8545/",
        "0xf01c9C83C65804f24e680675A18f47D5FF58e6bC",
        "0x3B62C5EaF9faf8bd6Ed56a5e106a46EAAcBAb27d");

    let balance = await dexHege.tokenBalanceOf(
        "0xFe57a912FcE2aE127CaCeDBBf8486A6891345eB9",
        "0xa2D644EF59A735f6249D76aAB98F071523129Bb0")
    console.log("balance:", balance);

    let decimals = await dexHege.tokenDecimals("0xFe57a912FcE2aE127CaCeDBBf8486A6891345eB9")
    console.log("decimals:", decimals);

    let reserves = await dexHege.getBatPairReserves(
        ["0xFe57a912FcE2aE127CaCeDBBf8486A6891345eB9",
            "0xb9725546A70976CC2061cfBD2cc86Ef7A0e9Fa23",
            "0xb9725546A70976CC2061cfBD2cc86Ef7A0e9Fa23",
            "0xFe57a912FcE2aE127CaCeDBBf8486A6891345eB9"]);
    console.log("decimals:", reserves);

    let tx = await dexHege.hedgeSwap(0,
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("0"),
        ["0xFe57a912FcE2aE127CaCeDBBf8486A6891345eB9", "0xb9725546A70976CC2061cfBD2cc86Ef7A0e9Fa23"],
        Math.floor(Date.now()/1000+100));
    console.log(tx);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });