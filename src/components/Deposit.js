import React, { useState, useEffect } from 'react';
import "../assets/style/deposit.scss";
import { Form, Spinner, Image } from "react-bootstrap"
import { Ethereum, Usdt, Btc, Solana } from 'react-web3-icons';
import toIcn from "../assets/images/wibe.png"
import { IoMdWallet } from "react-icons/io"
import { FaEthereum } from "react-icons/fa"
import { useAccount, useConnect, useNetwork, useSwitchNetwork, useBalance, useToken } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import TabMenu from './TabMenu';
import { HiSwitchHorizontal } from "react-icons/hi"
import metamask from "../assets/images/metamask.svg"
import Web3 from 'web3';
import portalProxyABI from "../ABI/portalProxy.json";
import wibeABI from "../ABI/styleoCoin.json";
const optimismSDK = require("@eth-optimism/sdk")
const ethers = require("ethers")

const Deposit = () => {
    const [transactionHash, setTransactionHash] = useState(""); // New state for transaction hash 
    const [ethValue, setEthValue] = useState("")
    const [sendToken, setSendToken] = useState("WIBE")
    const { data: accountData, address, isConnected } = useAccount()
    const [errorInput, setErrorInput] = useState("")
    const [loader, setLoader] = useState(false)
    const { chain, chains } = useNetwork()
    const [checkMetaMask, setCheckMetaMask] = useState("");
    const web3 = new Web3(window.ethereum);

    const { connect, connectors, error, isLoading, pendingConnector } = useConnect({
        connector: new InjectedConnector({ chains }), onError(error) {
            console.log('Error', error)
        },
        onMutate(args) {
            console.log('Mutate', args)
            if (args.connector.ready === true) {
                setCheckMetaMask(false)
            } else {
                setCheckMetaMask(true)
            }
        },
        onSettled(data, error) {
            console.log('Settled', { data, error })
        },
        onSuccess(data) {
            console.log('Success', data)
        },
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

    const dataWIBE = useBalance({ address: address, token: process.env.REACT_APP_CGT_ADDRESS, watch: true, chainId: Number(process.env.REACT_APP_L1_CHAIN_ID) })
    const dataUSDT = useBalance({ address: address, token: process.env.REACT_APP_L1_USDT, watch: true, chainId: Number(process.env.REACT_APP_L1_CHAIN_ID) })
    const dataWBTC = useBalance({ address: address, token: process.env.REACT_APP_L1_wBTC, watch: true, chainId: Number(process.env.REACT_APP_L1_CHAIN_ID) })
    const dataWSOL = useBalance({ address: address, token: process.env.REACT_APP_SOL_L1, watch: true, chainId: Number(process.env.REACT_APP_L1_CHAIN_ID) })

    const portal = new web3.eth.Contract(portalProxyABI, process.env.REACT_APP_OPTIMISM_PORTAL_PROXY)
    const wibe = new web3.eth.Contract(wibeABI, process.env.REACT_APP_CGT_ADDRESS)
    const handleSwitch = () => {
        switchNetwork(process.env.REACT_APP_L1_CHAIN_ID)
    }


    const handleDeposit = async () => {
        try {
            if (!ethValue) {
                setErrorInput("Please enter the amount");
            }
            else {
                if (!parseFloat(ethValue) > 0) {
                    setErrorInput("Invalid Amount Entered!");
                } else {
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
                        AddressManager: process.env.REACT_APP_ADDRESS_MANAGER,
                        L1CrossDomainMessenger: process.env.REACT_APP_L1_CROSS_DOMAIN_MESSANGER_PROXY,
                        L1StandardBridge: process.env.REACT_APP_L1_STANDARD_BRIDGE_PROXY,
                        OptimismPortal: process.env.REACT_APP_OPTIMISM_PORTAL_PROXY,
                        L2OutputOracle: process.env.REACT_APP_L2_OUTPUT_ORACLE_PROXY,
                    }
                    const bridges = {
                        Standard: {
                            l1Bridge: l1Contracts.L1StandardBridge,
                            l2Bridge: process.env.REACT_APP_L2_BRIDGE,
                            Adapter: optimismSDK.StandardBridgeAdapter
                        },
                        ETH: {
                            l1Bridge: l1Contracts.L1StandardBridge,
                            l2Bridge: process.env.REACT_APP_L2_BRIDGE,
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

                    if (sendToken === "WIBE") {
                        console.log(sendToken);
                        const weiValue = web3.utils.toWei(ethValue, 'ether');  // Using Web3's toWei
                        setLoader(true);
                        // Approve WIBE
                        const approveWIBE = await wibe.methods.approve(process.env.REACT_APP_OPTIMISM_PORTAL_PROXY, weiValue).send({ from: address });

                        if (approveWIBE.status) {
                            const depositWIBE = await portal.methods.depositERC20Transaction(address, weiValue, weiValue, 21000, false, "0x").send({ from: address });
                            if (depositWIBE.status) {
                                setTransactionHash(depositWIBE.transactionHash); // This is where we set the transaction hash
                                setLoader(false);
                                setEthValue("");
                            }
                        }
                    }

                    // USDT via Standard Bridge
                    else if (sendToken === "USDT") {
                        const usdtValue = parseInt(Number(ethValue) * 1000000);
                        setLoader(true);
                        const approveTx = await crossChainMessenger.approveERC20(process.env.REACT_APP_L1_USDT, process.env.REACT_APP_L2_USDT, usdtValue);
                        await approveTx.wait();
                        const depositTx = await crossChainMessenger.depositERC20(process.env.REACT_APP_L1_USDT, process.env.REACT_APP_L2_USDT, usdtValue);
                        const receipt = await depositTx.wait();
                        if (receipt) {
                            setLoader(false);
                            setEthValue("");
                        }
                    }

                    // wBTC via Standard Bridge
                    else if (sendToken === "wBTC") {
                        const wbtcValue = parseInt(Number(ethValue) * 100000000);
                        setLoader(true);
                        const approveTx = await crossChainMessenger.approveERC20(process.env.REACT_APP_L1_wBTC, process.env.REACT_APP_L2_wBTC, wbtcValue);
                        await approveTx.wait();
                        const depositTx = await crossChainMessenger.depositERC20(process.env.REACT_APP_L1_wBTC, process.env.REACT_APP_L2_wBTC, wbtcValue);
                        const receipt = await depositTx.wait();
                        if (receipt) {
                            setLoader(false);
                            setEthValue("");
                        }
                    }

                    // wSOL via Standard Bridge (envs: REACT_APP_SOL_L1 / REACT_APP_SOL_l2)
                    else if (sendToken === "wSOL") {
                        const wsolValue = parseInt(Number(ethValue) * 1000000000);
                        setLoader(true);
                        const approveTx = await crossChainMessenger.approveERC20(process.env.REACT_APP_SOL_L1, process.env.REACT_APP_SOL_l2, wsolValue);
                        await approveTx.wait();
                        const depositTx = await crossChainMessenger.depositERC20(process.env.REACT_APP_SOL_L1, process.env.REACT_APP_SOL_l2, wsolValue);
                        const receipt = await depositTx.wait();
                        if (receipt) {
                            setLoader(false);
                            setEthValue("");
                        }
                    }

                }
            }
        } catch (error) {
            console.log(error)
            setLoader(false);
        }
    }
    const copyToClipboard = () => {
        navigator.clipboard.writeText(transactionHash);
        alert("Transaction Hash Copied!");
    };
    const [checkDisabled, setCheckDisabled] = useState(false)
    const handleChange = (e) => {
        const value = e.target.value
        if (sendToken === 'WIBE') {
            if (Number(dataWIBE.data?.formatted) < value) {
                setErrorInput("Insufficient WIBE balance.")
                setCheckDisabled(true)
            } else {
                setCheckDisabled(false)
                setErrorInput("")
            }
        } else if (sendToken === 'USDT') {
            if (Number(dataUSDT.data?.formatted) < value) {
                setErrorInput("Insufficient USDT balance.")
                setCheckDisabled(true)
            } else {
                setCheckDisabled(false)
                setErrorInput("")
            }
        } else if (sendToken === 'wBTC') {
            if (Number(dataWBTC.data?.formatted) < value) {
                setErrorInput("Insufficient wBTC balance.")
                setCheckDisabled(true)
            } else {
                setCheckDisabled(false)
                setErrorInput("")
            }
        } else if (sendToken === 'wSOL') {
            if (Number(dataWSOL.data?.formatted) < value) {
                setErrorInput("Insufficient wSOL balance.")
                setCheckDisabled(true)
            } else {
                setCheckDisabled(false)
                setErrorInput("")
            }
        }
        setEthValue(value)
    }

    return (
        <>
            <div className='bridge_wrap'>
                <TabMenu />
                <section className='deposit_wrap'>
                    <div className='deposit_price_wrap'>
                        <div className='deposit_price_title'>
                            <p>From</p>
                            <h5><FaEthereum /> Sepolia Testnet</h5>
                        </div>
                        <div className='deposit_input_wrap'>
                            <Form>
                                <div className='deposit_inner_input'>
                                    <Form.Control type='number' value={ethValue} onChange={handleChange} placeholder="0" min="0" step="any" />
                                    <Form.Select aria-label="Select token" className='select_wrap' value={sendToken} onChange={({ target }) => setSendToken(target.value)}>
                                        <option value="WIBE">WIBE</option>
                                        <option value="USDT">USDT</option>
                                        <option value="wBTC">wBTC</option>
                                        <option value="wSOL">wSOL</option>
                                    </Form.Select>
                                </div>
                                <div className='input_icn_wrap'>
                                    {sendToken === 'WIBE' ? (
                                        <span className='input_icn'><img src={require("../assets/images/wibe.png")} alt="WIBE Logo" style={{ width: '24px', height: '24px' }} /></span>
                                    ) : sendToken === 'USDT' ? (
                                        <span className='input_icn'><Usdt style={{ fontSize: '1.5rem' }} /></span>
                                    ) : sendToken === 'wBTC' ? (
                                        <span className='input_icn'><Btc style={{ fontSize: '1.5rem' }} /></span>
                                    ) : (
                                        <span className='input_icn'><Solana style={{ fontSize: '1.5rem' }} /></span>
                                    )}
                                </div>
                            </Form>
                        </div>
                        {errorInput && <small className='text-danger'>{errorInput}</small>}
                        {address && (
                            sendToken === 'WIBE' ? <p className='wallet_bal mt-2'>Balance: {Number(dataWIBE.data?.formatted).toFixed(5)} WIBE</p> :
                            sendToken === 'USDT' ? <p className='wallet_bal mt-2'>Balance: {Number(dataUSDT.data?.formatted).toFixed(5)} USDT</p> :
                            sendToken === 'wBTC' ? <p className='wallet_bal mt-2'>Balance: {Number(dataWBTC.data?.formatted).toFixed(5)} wBTC</p> :
                            <p className='wallet_bal mt-2'>Balance: {Number(dataWSOL.data?.formatted).toFixed(5)} wSOL</p>
                        )}
                    </div>
                    <div className='deposit_details_wrap'>
                        <div className="deposit_details">
                            <p>To</p>
                            <h5> <img src={require("../assets/images/wibe.png")} alt="WIBE Logo" style={{ width: '24px', height: '24px' }} />Wibe Testnet</h5>
                        </div>
                        <div className='deposit_inner_details'>
                            {sendToken === 'WIBE' ? (
                                <span className='input_icn'><img src={require("../assets/images/wibe.png")} alt="WIBE Logo" style={{ width: '24px', height: '24px' }} /></span>
                            ) : sendToken === 'USDT' ? (
                                <span className='input_icn'><Usdt style={{ fontSize: '1.5rem' }} /></span>
                            ) : sendToken === 'wBTC' ? (
                                <span className='input_icn'><Btc style={{ fontSize: '1.5rem' }} /></span>
                            ) : (
                                <span className='input_icn'><Solana style={{ fontSize: '1.5rem' }} /></span>
                            )}
                            <p> You'll receive: {ethValue ? ethValue : "0"} {sendToken}</p>
                        </div>
                    </div>
                    <div className="deposit_btn_wrap">
                        {checkMetaMask === true ? <a className='btn deposit_btn' href='https://metamask.io/' target='_blank'><Image src={metamask} alt="metamask icn" fluid /> Please Install Metamask Wallet</a> : !isConnected ? <button className='btn deposit_btn' onClick={() => connect()}><IoMdWallet />Connect Wallet</button> : chain.id !== Number(process.env.REACT_APP_L1_CHAIN_ID) ? <button className='btn deposit_btn' onClick={handleSwitch}><HiSwitchHorizontal />Switch to Sepolia</button> :
                            checkDisabled ? <button className='btn deposit_btn' disabled={true}>Deposit</button> :
                                <button className='btn deposit_btn' onClick={handleDeposit} disabled={loader ? true : false}> {loader ? <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner> : "Deposit"} </button>}
                    </div>
                    {transactionHash && (
                        <div className="transaction_details">
                            <p>Transaction Hash:</p>
                            <a
                                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {transactionHash}
                            </a>
                            <button onClick={copyToClipboard} className="copy_button">
                                Copy Transaction Hash
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </>
    )
}

export default Deposit
