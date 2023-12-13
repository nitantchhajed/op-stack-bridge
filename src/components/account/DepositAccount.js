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
            type: process.env.REACT_APP_L1_DAI,
            tokenSymbol: "DAI",
            decimalValue: 18
        },
        {
            type: process.env.REACT_APP_L1_USDT,
            tokenSymbol: "USDT",
            decimalValue: 6
        },
        {
            type: process.env.REACT_APP_L1_USDC,
            tokenSymbol: "USDC",
            decimalValue: 6
        },
        {
            type: process.env.REACT_APP_L1_wBTC,
            tokenSymbol: "wBTC",
            decimalValue: 8
        }
    ]

    const { address, isConnected } = useAccount()
    const [depositDetails, setDepositDetails] = useState([])
    const getDeposit = async () => {
        const l1Provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_L1_RPC_URL);
        const l2Provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_L2_RPC_URL);
        const l1Signer = l1Provider.getSigner()
        const l2Signer = l2Provider.getSigner()
        const zeroAddr = "0x".padEnd(42, "0");
        const l1Contracts = {
            StateCommitmentChain: zeroAddr,
            CanonicalTransactionChain: zeroAddr,
            BondManager: zeroAddr,
            AddressManager: process.env.REACT_APP_LIB_ADDRESSMANAGER,
            L1CrossDomainMessenger: process.env.REACT_APP_PROXY_OVM_L1CROSSDOMAINMESSENGER,
            L1StandardBridge: process.env.REACT_APP_PROXY_OVM_L1STANDARDBRIDGE,
            OptimismPortal: process.env.REACT_APP_OPTIMISM_PORTAL_PROXY,
            L2OutputOracle: process.env.REACT_APP_L2_OUTPUTORACLE_PROXY,
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
        const data = await crossChainMessenger.getDepositsByAddress(address)
        for (let index = 0; index < data.length; index++) {
            let timestamp = (await l1Provider.getBlock(data[index].blockNumber)).timestamp;
            data[index].timestamp = timestamp
        }
        setDepositDetails(data)
        if (data) {
            setLoader(true)
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
                                !loader ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : depositDetails?.length <= 0 ? <h4 className='text-center text-white'>No Transaction Found</h4> :
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
                                                        <td>{retrieveEthValue(amount, l1Token)} {tokenList.filter(a => a.type === l1Token)[0]?.tokenSymbol === undefined ? "ETH" : tokenList.filter(a => a.type === l1Token)[0]?.tokenSymbol}</td>
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