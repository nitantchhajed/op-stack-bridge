import React, { useState } from 'react';
import Web3 from "web3"
import "../assets/style/deposit.scss";
import { Form, Spinner, Image } from "react-bootstrap"
import toIcn from "../assets/images/logo.png"
import { IoMdWallet } from "react-icons/io"
import { FaEthereum } from "react-icons/fa"
import { useAccount, useConnect, useNetwork, useSwitchNetwork, useBalance } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import TabMenu from './TabMenu';
import { HiSwitchHorizontal } from "react-icons/hi"
const optimismSDK = require("@eth-optimism/sdk")
const ethers = require("ethers")
const Deposit = () => {
    const [ethValue, setEthValue] = useState("")
    const [sendToken, setSendToken] = useState("ETH")
    const { address, isConnected } = useAccount()
    const [errorInput, setErrorInput] = useState("")
    const [loader, setLoader] = useState(false)
    const { chain, chains } = useNetwork()
    const { connect } = useConnect({
        connector: new InjectedConnector({
            chains
        })
    })
    const { switchNetwork } = useSwitchNetwork({
        throwForSwitchChainNotSupported: true,
        onError(error) {
            console.log('Error', error)
        },
        onMutate(args) {
            console.log('Mutate', args)
        },
        onSettled(data, error) {
            console.log('Settled', { data, error })
        },
        onSuccess(data) {
            console.log('Success', data)
        },
    })
    const { data } = useBalance({ address: address })
    const handleSwitch = () => {
        switchNetwork(process.env.REACT_APP_L1_CHAIN_ID)
    }

    const handleDeposit = async () => {
        try {
            if (ethValue) {
                setErrorInput("")
                const l2Url = process.env.REACT_APP_L2_RPC_URL;
                const l1Provider = new ethers.providers.Web3Provider(window.ethereum);
                const l2Provider = new ethers.providers.JsonRpcProvider(l2Url, 'any')
                const l1Signer = l1Provider.getSigner(address)
                const l2Signer = l2Provider.getSigner(address)
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
                const weiValue = parseInt(ethers.utils.parseEther(ethValue)._hex, 16)
                const depositETHEREUM = await crossChainMessenger.depositETH(weiValue.toString())
                setLoader(true);
                const receipt =  await depositETHEREUM.wait()
                console.log(receipt);
                if(receipt){
                    setLoader(false);
                    setEthValue("")
                }
            } else {
                setErrorInput("Please enter the amount")
                setLoader(false);
            }
        } catch (error) {
            console.log(error)
            setLoader(false);
        }
    }
    const handleChange = ({ target }) => {
        if (data?.formatted < target.value) {
            setErrorInput("Insufficient ETH balance.")
        } else {
            setErrorInput("")
        }
        setEthValue(target.value)
    }
    return (
        <>
            <div className='bridge_wrap'>
                <TabMenu />
                <section className='deposit_wrap'>
                    <div className='deposit_price_wrap'>
                        <div className='deposit_price_title'>
                            <p>From</p>
                            <h5><FaEthereum /> Goerli Testnet</h5>
                        </div>
                        <div className='deposit_input_wrap'>
                            <Form>
                                <div className='deposit_inner_input'>
                                    <Form.Control type='number' value={ethValue} onChange={handleChange} placeholder="0" min="0" step="any" />
                                    <Form.Select aria-label="Default select example" className='select_wrap' onChange={({ target }) => setSendToken(target.value)}>
                                        <option>ETH</option>
                                        <option value="DAI">DAI</option>
                                        <option value="USDC">USDC</option>
                                        <option value="USDT">USDT</option>
                                    </Form.Select>
                                </div>
                                <div className='input_icn_wrap'>
                                    <span className='input_icn'><FaEthereum /></span>
                                </div>
                            </Form>
                        </div>
                        {errorInput && <small className='text-danger'>{errorInput}</small>}
                        {address && <p className='wallet_bal mt-2'>Balance: {Number(data?.formatted).toFixed(5)} ETH</p>}
                    </div>
                    <div className='deposit_details_wrap'>
                        <div className="deposit_details">
                            <p>To</p>
                            <h5><Image src={toIcn} alt="To icn" fluid /> Race</h5>
                        </div>
                        <div className='deposit_inner_details'>
                            <Image src={toIcn} alt="To icn" fluid />  <p>You’ll receive: {ethValue ? ethValue : "0"} {sendToken}</p>
                        </div>
                    </div>
                    <div className="deposit_btn_wrap">
                        {!isConnected ? <button className='btn deposit_btn' onClick={() => connect()}><IoMdWallet />Connect Wallet</button> : chain.id !== Number(process.env.REACT_APP_L1_CHAIN_ID) ? <button className='btn deposit_btn' onClick={handleSwitch}><HiSwitchHorizontal />Switch to goerli</button> :
                            <button className='btn deposit_btn' onClick={handleDeposit} disabled={loader ? true : false}> {loader ? <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner> : "Deposit"} </button>}
                    </div>
                </section>
            </div>
        </>
    )
}

export default Deposit