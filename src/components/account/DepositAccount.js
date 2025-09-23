import React, { useEffect, useState } from 'react'
import { Container, Table } from "react-bootstrap"
import { ethers } from "ethers"
import { useAccount } from 'wagmi'
import ReactPaginate from 'react-paginate'
import Account from './Account'
const optimismSDK = require("@eth-optimism/sdk")

const DepositAccount = () => {
    const [loader, setLoader] = useState(false)
    const tokenList = [
        {
            type: process.env.REACT_APP_CGT_ADDRESS,
            tokenSymbol: "WIBE",
            decimalValue: 18
        }
    ]

    const { address, isConnected } = useAccount()
    const [depositDetails, setDepositDetails] = useState([])
    const getDeposit = async () => {
        try {
            const l1Provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_L1_RPC_URL);
            const l2Provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_L2_RPC_URL);
            const l1Signer = l1Provider.getSigner()
            const l2Signer = l2Provider.getSigner()
            const zeroAddr = "0x".padEnd(42, "0");
            const l1Contracts = {
                StateCommitmentChain: zeroAddr,
                CanonicalTransactionChain: zeroAddr,
                BondManager: zeroAddr,
                AddressManager: process.env.REACT_APP_ADDRESS_MANAGER,
                L1CrossDomainMessenger: process.env.REACT_APP_L1_CROSS_DOMAIN_MESSANGER_PROXY,
                L1StandardBridge: process.env.REACT_APP_L1_STANDARD_BRIDGE_PROXY,
                OptimismPortal: process.env.REACT_APP_OPTIMISM_PORTAL_PROXY,
                L2OutputOracle: process.env.REACT_APP_L2_OUTPUT_ORACLE_PROXY,
            }
            // console.log(l1Contracts);
            const bridges = {
                Standard: {
                    l1Bridge: l1Contracts.L1StandardBridge,
                    l2Bridge: "0x4200000000000000000000000000000000000010",
                    Adapter: optimismSDK.StandardBridgeAdapter
                },
                ETH: {
                    l1Bridge: l1Contracts.L1StandardBridge,
                    l2Bridge: "0x4200000000000000000000000000000000000010",
                    Adapter: optimismSDK.ETHBridgeAdapter
                }
            }
            const crossChainMessenger = new optimismSDK.CrossChainMessenger({
                contracts: {
                    l1: l1Contracts,
                },
                bridges: bridges,
                l1ChainId: Number(process.env.REACT_APP_L1_CHAIN_ID),
                l2ChainId: Number(process.env.REACT_APP_L2_CHAIN_ID),
                l1SignerOrProvider: l1Signer,
                l2SignerOrProvider: l2Signer,
                bedrock: true,
            })
            // Get current block number to limit the range
            const currentBlock = await l1Provider.getBlockNumber()
            
            // Try different block ranges, starting with the smallest and increasing
            let data = []
            const blockRanges = [100] // Try 1, 5, then 9 blocks
            
            for (const range of blockRanges) {
                try {
                    const fromBlock = Math.max(0, currentBlock - range)
                    data = await crossChainMessenger.getDepositsByAddress(address, {
                        fromBlock: fromBlock,
                        toBlock: currentBlock
                    })
                    console.log(`Successfully fetched deposits with ${range} block range`)
                    break // If successful, break out of the loop
                } catch (error) {
                    console.log(`Failed with ${range} block range, trying smaller range...`)
                    if (range === blockRanges[blockRanges.length - 1]) {
                        throw error // If this was the last attempt, throw the error
                    }
                }
            }
            for (let index = 0; index < data.length; index++) {
                let timestamp = (await l1Provider.getBlock(data[index].blockNumber)).timestamp;
                data[index].timestamp = timestamp
            }
            setDepositDetails(data)
            if (data) {
                setLoader(true)
            }
        } catch (error) {
            console.error("Error fetching deposits:", error);
            setDepositDetails([]);
            setLoader(true);
        }
    }
    function timeConverter(timestamp) {
        var a = new Date(timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    /*

     */

    function retrieveEthValue(amount, givenType) {
        const weiValue = parseInt(amount._hex, 16);
        const dynamicDecimal = tokenList.filter(a => a.type === givenType)[0]?.decimalValue === undefined ? 18 : tokenList.filter(a => a.type === givenType)[0]?.decimalValue
        console.log("dynamicDecimal", dynamicDecimal);
        return weiValue / Number("1".padEnd(dynamicDecimal + 1, 0));
    }

    useEffect(() => {
        if (isConnected) {
            getDeposit()
        }
    }, [address])
    // =============all Collections pagination start===============
    const [currentItemsCollections, setCurrentItemsCollections] = useState([]);
    const [pageCountCollections, setPageCountCollections] = useState(0);
    const [itemOffsetCollections, setItemOffsetCollections] = useState(0);
    const itemsPerPageCollections = 10;


    useEffect(() => {
        if (depositDetails) {
            const endOffsetCollections = itemOffsetCollections + itemsPerPageCollections;
            setCurrentItemsCollections(depositDetails.slice(itemOffsetCollections, endOffsetCollections));
            setPageCountCollections(Math.ceil(depositDetails.length / itemsPerPageCollections));
        } else {

        }
    }, [depositDetails, itemOffsetCollections, itemsPerPageCollections]);

    const handlePageClickCollections = (event) => {
        const newOffsetCollections =
            (event.selected * itemsPerPageCollections) % depositDetails.length;
        setItemOffsetCollections(newOffsetCollections);
    };
    // =============all Collections pagination end===============
    useEffect(() => {
        console.log({ depositDetails, currentItemsCollections })
    }, [depositDetails, currentItemsCollections])
    return (
        <>
            <div className="account_wrap">
                <Container>
                    <div className='account_inner_wrap'>
                        <Account />
                        <section className="account_withdraw_table">
                            {
                                !loader ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : depositDetails?.length <= 0 ? <div className='text-center text-white'><h4>No Transaction Found</h4><p className='text-muted'>Showing recent deposits only due to RPC limitations. If you made deposits recently, they should appear here.</p></div> :
                                    <Table responsive bordered hover variant="dark">
                                        <thead>
                                            <tr>
                                                <th>Time</th>
                                                <th>Type</th>
                                                <th>Amount</th>
                                                <th>Transaction</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItemsCollections.map((element, index) => {
                                                const { timestamp, transactionHash, amount, l1Token } = element
                                                // console.log("amount", tokenList.filter(a => a.type === l1Token)[0]?.tokenSymbol);
                                                return (
                                                    <tr key={index}>
                                                        <td>{timeConverter(timestamp)}</td>
                                                        <td>Deposit</td>
                                                        <td>{retrieveEthValue(amount, l1Token)} {tokenList.filter(a => a.type === l1Token)[0]?.tokenSymbol === undefined ? "Token" : tokenList.filter(a => a.type === l1Token)[0]?.tokenSymbol}</td>
                                                        <td> <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target='_blank'> {`${transactionHash.slice(0, 8)}...${transactionHash.slice(-8)}`}</a></td>
                                                        <td>Completed</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>}
                            {depositDetails?.length > 10 ? <div className='pagination_wrap'>
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel=" >>"
                                    onPageChange={handlePageClickCollections}
                                    pageRangeDisplayed={1}
                                    marginPagesDisplayed={1}
                                    pageCount={pageCountCollections}
                                    previousLabel="<< "
                                    containerClassName="pagination justify-content-end"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    activeClassName="active"
                                />
                            </div> : ""}
                        </section>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default DepositAccount