import React, { useEffect, useState } from 'react'
import { Table } from "react-bootstrap";
// const ethers = require("ethers")
const optimismSDK = require("@eth-optimism/sdk")
const WithdrawAccount = () => {
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
                        {/* {walletDetails.map((element, index) => {
                            const { timestamp, message, transactionHash, amount, messageStatus } = element
                            console.log("amount", amount._hex);
                            return (
                                <tr key={index}>
                                    <td>{timeConverter(timestamp)}</td>
                                    <td>Withdraw</td>
                                    <td>{parseInt(amount._hex, 16) / 1000000000000000000} ETH</td>
                                    <td>{`${transactionHash.slice(0, 8)}...${transactionHash.slice(-8)}`}</td>
                                    <td>{message} {messageStatus === 3 ? <button type='button' className='btn withdraw_inner_btn' onClick={() => handleProve(transactionHash)}>Prove</button> : messageStatus === 5 ? <button type='button' className='btn withdraw_inner_btn' onClick={() => handleClaim(transactionHash)}>Claim</button> : ""} </td>
                                </tr>
                            )
                        })} */}

                    </tbody>
                </Table>
                {/* {!checkMetamaskTest && <MetamaskPopUp />} */}
            </section>
        </>
    )
}

export default WithdrawAccount