const optimism = require("@eth-optimism/sdk");
const ethers = require("ethers");

async function execute() {
    const l1RpcUrl = "https://eth-sepolia.g.alchemy.com/v2/kSNqyjVYwVcoyyMknd7NOq7xLofs05WQ";
    const l2RpcUrl = "https://testnet.styleochain.com/";
    const address = '0x1B061133F3b0E5cb1Cb54d5859eEd447d289606f';
    const l1Provider = new ethers.providers.StaticJsonRpcProvider(l1RpcUrl);
    const l2Provider = new ethers.providers.StaticJsonRpcProvider(l2RpcUrl);

    const zeroAddr = ethers.constants.AddressZero;

    const l1Contracts = {
        StateCommitmentChain: zeroAddr,
        CanonicalTransactionChain: zeroAddr,
        BondManager: zeroAddr,
        AddressManager: "0xd805F52613C6a443Db0434552A63e72c27d530c4",
        L1CrossDomainMessenger: "0x94246a67Cfd0fe6c8Bc27d4ED842D329854209e2",
        L1StandardBridge: "0x3345b86284eb0D4b781cb517D6A82cB49d2118c1",
        OptimismPortal: "0x70e81400b2e4d7Dff9174Ef6941B3fd513829052",
        L2OutputOracle: "0xdc58E4b60DdeA49475a74447A2cFF0c89cc03633",
    };
    const transactionHash="0x791a61f73951ed6fbcbe5409398ec55cdbeee7b9a0078ed26156701ed0caee3c"
    const bridges = {
        Standard: {
            l1Bridge: l1Contracts.L1StandardBridge,
            l2Bridge: "0x4200000000000000000000000000000000000010",
            Adapter: optimism.StandardBridgeAdapter
        },
        ETH: {
            l1Bridge: l1Contracts.L1StandardBridge,
            l2Bridge: "0x4200000000000000000000000000000000000010",
            Adapter: optimism.ETHBridgeAdapter
        }
    };

    const messenger = new optimism.CrossChainMessenger({
        contracts: {
            l1: l1Contracts,
        },
        bridges: bridges,
        l1ChainId: 11155111, // 11155111 for Sepolia, 1 for Ethereum
        l2ChainId: 4267, // 11155420 for OP Sepolia, 10 for OP Mainnet
        l1SignerOrProvider: l1Provider,
        l2SignerOrProvider: l2Provider,
        bedrock: true,

    });
    console.log("hiiiiiiiiiiii");
    let getStatus = await messenger.getMessageStatus(transactionHash)
    console.log("Status", getStatus);
    
    
//     const deposits = await messenger.getDepositsByAddress(address);

//     for (const deposit of deposits) {
//         console.log('----------------------------------------------------');
//         console.log('From:    ', deposit.from);
//         console.log('To:      ', deposit.to);
//         console.log('L1 Token:', deposit.l1Token);
//         console.log('L2 Token:', deposit.l2Token);
//         console.log('Amount:  ', deposit.amount.toString());
//     }
// console.log("byeeeeeeeeeeeeeeeeeee");

//     const withdrawals = await messenger.getWithdrawalsByAddress(address);

//     for (const withdrawal of withdrawals) {
//         console.log('----------------------------------------------------');
//         console.log('From:    ', withdrawal.from);
//         console.log('To:      ', withdrawal.to);
//         console.log('L1 Token:', withdrawal.l1Token);
//         console.log('L2 Token:', withdrawal.l2Token);
//         console.log('Amount:  ', withdrawal.amount.toString());
//     }
}

execute().catch((error) => {
    console.error("Error executing script:", error);
    process.exit(1);
});
