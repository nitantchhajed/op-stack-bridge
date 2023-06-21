import React, { useEffect, useState } from 'react'
import { Table } from "react-bootstrap"
import { ethers } from "ethers"
import Web3 from "web3"
const optimismSDK = require("@eth-optimism/sdk")

const DepositAccount = () => {
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
                    {/* {depositDetails.map((element, index) => {
                            const { timestamp, transactionHash, amount } = element
                            console.log("amount", amount._hex);
                            return (
                                <tr key={index}>
                                    <td>{timeConverter(timestamp)}</td>
                                    <td>Deposit</td>
                                    <td>{retrieveEthValue(amount)} ETH</td>
                                    <td>{`${transactionHash.slice(0, 8)}...${transactionHash.slice(-8)}`}</td>
                                    <td>Completed</td>
                                </tr>
                            )
                            })} */}
                    </tbody>
                </Table>
            </section>
        </>
    )
}

export default DepositAccount