import React, { useEffect, useState } from 'react';
import Web3 from "web3"
import "../assets/style/deposit.scss";
import { Form, Spinner, Image } from "react-bootstrap"
import toIcn from "../assets/images/logo.png"
import { IoMdWallet } from "react-icons/io"
import { FaEthereum } from "react-icons/fa"
import { useAccount, useConnect, useNetwork, useSwitchNetwork, useBalance } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const Deposit = () => {
    const [ethValue, setEthValue] = useState("")
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({ connector: new InjectedConnector() })
    const { chain } = useNetwork()
    const { switchNetwork } = useSwitchNetwork()
    const handleSwitch = () => {
        switchNetwork(process.env.REACT_APP_L1_CHAIN_ID)
    }
    useEffect(()=>{
        console.log("process.env.REACT_APP_L1_CHAIN_ID", typeof process.env.REACT_APP_L1_CHAIN_ID);
    },[])
    const handleDeposit = async () => {
        const web3 = new Web3(window.ethereum);
        const contractAddress = process.env.REACT_APP_OPTIMISM_PORTAL_PROXY;
        const amountToSendWei = web3.utils.toWei(ethValue.toString(), 'ether');
        console.log("amountToSendWei", amountToSendWei);
        const receipt = await web3.eth.sendTransaction({ to: contractAddress, from: address, value: amountToSendWei })
        console.log("logs", receipt);
    }
    const { data, isError, isLoading } = useBalance({ address: address })
    return (
        <>
            <section className='deposit_wrap'>
                <div className='deposit_price_wrap'>
                    <div className='deposit_price_title'>
                        <p>From</p>
                        <h5><FaEthereum /> Goerli Testnet</h5>
                    </div>
                    <div className='deposit_input_wrap'>
                        <Form>
                            <div className='deposit_inner_input'>
                                <Form.Control type='number' value={ethValue} onChange={(event) => setEthValue(event.target.value)} placeholder="0" step="any" />
                                <Form.Select aria-label="Default select example" className='select_wrap'>
                                    <option>ETH</option>
                                </Form.Select>
                            </div>
                            <div className='input_icn_wrap'>
                                <span className='input_icn'><FaEthereum /></span>
                            </div>
                        </Form>
                    </div>
                    {address && <p className='wallet_bal mt-2'>Balance: {Number(data?.formatted).toFixed(5)} ETH</p>}
                </div>
                <div className='deposit_details_wrap'>
                    <div className="deposit_details">
                        <p>To</p>
                        <h5><Image src={toIcn} alt="To icn" fluid /> Race</h5>
                    </div>
                    <div className='deposit_inner_details'>
                        <Image src={toIcn} alt="To icn" fluid />  <p>You’ll receive: 0 ETH</p>
                    </div>
                </div>
                <div className="deposit_btn_wrap">
                    {!isConnected ? <button className='btn deposit_btn' onClick={() => connect()}><IoMdWallet />Connect Wallet</button> : chain.id !== Number(process.env.REACT_APP_L1_CHAIN_ID) ? <button className='btn deposit_btn' onClick={handleSwitch}><IoMdWallet />Switch to goerli</button> : <button className='btn deposit_btn' onClick={handleDeposit}><IoMdWallet />Deposit</button>}
                </div>
            </section >
        </>
    )
}

export default Deposit