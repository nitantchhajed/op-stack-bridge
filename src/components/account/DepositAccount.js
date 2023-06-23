import React, { useEffect, useState } from 'react'
import { Table } from "react-bootstrap"
import { ethers } from "ethers"
import { useAccount } from 'wagmi'
import ReactPaginate from 'react-paginate'
const optimismSDK = require("@eth-optimism/sdk")

const DepositAccount = () => {

    const { address, isConnected } = useAccount()
    const [depositDetails, setDepositDetails] = useState([])
    const getDeposit = async () => {
        const l1Provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/e0CsbXjGCT0xVVFc9MyaE7-olvSVAh4S');
        const l2Provider = new ethers.providers.JsonRpcProvider('https://racetestnet.io');
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
        // console.log("data", data);
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

    function retrieveEthValue(amount) {
        const weiValue = parseInt(amount._hex, 16);
        return weiValue / 1000000000000000000;
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
    return (
        <>
            <section className="account_withdraw_table">
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
                            const { timestamp, transactionHash, amount } = element
                            // console.log("amount", amount._hex);
                            return (
                                <tr key={index}>
                                    <td>{timeConverter(timestamp)}</td>
                                    <td>Deposit</td>
                                    <td>{retrieveEthValue(amount)} ETH</td>
                                    <td>{`${transactionHash.slice(0, 8)}...${transactionHash.slice(-8)}`}</td>
                                    <td>Completed</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
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
        </>
    )
}

export default DepositAccount