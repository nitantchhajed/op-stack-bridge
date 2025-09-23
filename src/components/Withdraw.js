// import React, { useEffect, useState } from 'react';
// import "../assets/style/deposit.scss";
// import "../assets/style/withdraw.scss";
// import { Form, Image, Spinner } from "react-bootstrap";
// import { Ethereum } from 'react-web3-icons';
// import { MdOutlineSecurity } from "react-icons/md"
// import { FaEthereum } from "react-icons/fa"
// import Web3 from 'web3';
// import toIcn from "../assets/images/wibe.png"
// import { useAccount, useConnect, useNetwork, useSwitchNetwork, useBalance } from 'wagmi'
// import { InjectedConnector } from 'wagmi/connectors/injected';
// import { IoMdWallet } from "react-icons/io"
// import { HiSwitchHorizontal } from "react-icons/hi";
// import metamask from "../assets/images/metamask.svg"
// import TabMenu from './TabMenu';
// import messagePasserABI from "../ABI/l2MessagePasser.json";
// import l2StandardBridgeABI from "../ABI/l2StandardBridge.json"
// const optimismSDK = require("@eth-optimism/sdk")
// const ethers = require("ethers")
// const Withdraw = () => {
//   const [ethValue, setEthValue] = useState("")
//   const [sendToken, setSendToken] = useState("WIBE")
//   const [errorInput, setErrorInput] = useState("")
//   const [transactionHash, setTransactionHash] = useState(""); // New state for transaction hash 
//   const [checkMetaMask, setCheckMetaMask] = useState("");
//   const [loader, setLoader] = useState(false)
//   const { address, isConnected } = useAccount()
//   const { chain, chains } = useNetwork()
//   const [RaceBalance, setRaceBalance] = useState(0)
//   const { connect } = useConnect({
//     connector: new InjectedConnector({ chains }), onError(error) {
//       console.log('Error', error)
//     },
//     onMutate(args) {
//       console.log('Mutate', args)
//       if (args.connector.ready === true) {
//         setCheckMetaMask(false)
//       } else {
//         setCheckMetaMask(true)
//       }
//     },
//     onSettled(data, error) {
//       console.log('Settled', { data, error })
//     },
//     onSuccess(data) {
//       console.log('Success', data)
//     },
//   })
//   const [metaMastError, setMetaMaskError] = useState("")
//   const { error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork({
//     // throwForSwitchChainNotSupported: true,
//     chainId: 4267,
//     onError(error) {
//       console.log('Error', error)
//     },
//     onMutate(args) {
//       console.log('Mutate', args)
//     },
//     onSettled(data, error) {
//       console.log('Settled', { data, error })
//       try {
//         window.ethereum.request({
//           method: "wallet_addEthereumChain",
//           params: [{
//             chainId: (function (dec) { return `0x${parseInt(dec, 10).toString(16)}`; })(process.env.REACT_APP_L2_CHAIN_ID),
//             rpcUrls: [process.env.REACT_APP_L2_RPC_URL],
//             chainName: process.env.REACT_APP_L2_NETWORK_NAME,
//             nativeCurrency: {
//               name: "Wibe Coin",
//               symbol: "WIBE",
//               decimals: 18
//             },
//             blockExplorerUrls: [process.env.REACT_APP_L2_EXPLORER_URL]
//           }]
//         }).then((data) => {
//           setMetaMaskError("")
//         }).catch((err) => {
//           if (err.code === -32002) {
//             setMetaMaskError("Request stuck in pending state")
//           }
//         });
//       }
//       catch (error) {
//         console.log(error);
//       }
//     },
//     onSuccess(data) {
//       console.log('Success', data)
// 
//     },
//   })
//   //========================================================== BALANCES =======================================================================
// 
//   const { data } = useBalance({ address: address, chainId: Number(process.env.REACT_APP_L2_CHAIN_ID), watch: true })
// 
// 
//   const web3 = new Web3(window.ethereum);
// 
//   const messagePasser = new web3.eth.Contract(messagePasserABI, process.env.REACT_APP_L2MESSAGEPASSER)
//   const l2Bridge = new web3.eth.Contract(l2StandardBridgeABI, process.env.REACT_APP_L2_BRIDGE)
// 
//   useEffect(() => {
//     console.log("dataWIBE", data)
//   }, [])
// 
//   ////========================================================== WITHDRAW =======================================================================
// 
//   const handleWithdraw = async () => {
//     try {
//       if (!ethValue) {
//         setErrorInput("Please enter the amount");
//       }
//       else {
//         if (!parseFloat(ethValue) > 0) {
//           setErrorInput("Invalid Amount Entered!");
//         } else {
//           setErrorInput("");
//           const l1Url = process.env.REACT_APP_L1_RPC_URL;
//           const l1Provider = new ethers.providers.JsonRpcProvider(l1Url, "any");
//           const l2Provider = new ethers.providers.Web3Provider(window.ethereum);
//           const l1Signer = l1Provider.getSigner(address)
//           const l2Signer = l2Provider.getSigner(address)
//           const zeroAddr = "0x".padEnd(42, "0");
//           const l1Contracts = {
//             StateCommitmentChain: zeroAddr,
//             CanonicalTransactionChain: zeroAddr,
//             BondManager: zeroAddr,
//             AddressManager: process.env.REACT_APP_ADDRESS_MANAGER,
//             L1CrossDomainMessenger: process.env.REACT_APP_L1_CROSS_DOMAIN_MESSANGER_PROXY,
//             L1StandardBridge: process.env.REACT_APP_L1_STANDARD_BRIDGE_PROXY,
//             OptimismPortal: process.env.REACT_APP_OPTIMISM_PORTAL_PROXY,
//             L2OutputOracle: process.env.REACT_APP_L2_OUTPUT_ORACLE_PROXY,
//           }
//           const bridges = {
//             Standard: {
//               l1Bridge: l1Contracts.L1StandardBridge,
//               l2Bridge: "0x4200000000000000000000000000000000000010",
//               Adapter: optimismSDK.StandardBridgeAdapter
//             },
//             ETH: {
//               l1Bridge: l1Contracts.L1StandardBridge,
//               l2Bridge: "0x4200000000000000000000000000000000000010",
//               Adapter: optimismSDK.ETHBridgeAdapter
//             }
//           }
//           const crossChainMessenger = new optimismSDK.CrossChainMessenger({
//             contracts: {
//               l1: l1Contracts,
//             },
//             bridges: bridges,
//             l1ChainId: Number(process.env.REACT_APP_L1_CHAIN_ID),
//             l2ChainId: Number(process.env.REACT_APP_L2_CHAIN_ID),
//             l1SignerOrProvider: l1Signer,
//             l2SignerOrProvider: l2Signer,
//             bedrock: true,
//           })
//           //-------------------------------------------------------- SEND TOKEN VALUE -----------------------------------------------------------------
// 
//           try {
//             if (sendToken == "WIBE") {
//               const weiValue = parseInt(ethers.utils.parseEther(ethValue)._hex, 16)
//               setLoader(true);
//               const initiateWithdraw = await messagePasser.methods.initiateWithdrawal(address, 21000, "0x").send({ from: address, value: weiValue })
//               console.log(initiateWithdraw);
//               if (initiateWithdraw.status) {
//                 setTransactionHash(initiateWithdraw.transactionHash); // Save the transaction hash
//                 setLoader(false);
//                 setEthValue("");
//               }
//             }
//             //-------------------------------------------------------- SEND TOKEN VALUE END-----------------------------------------------------------------
//             updateWallet()
//           }
//           catch (error) {
//             setLoader(false);
//             console.log({ error }, 98);
//           }
//         }
//       }
// 
//     } catch (error) {
//       console.log(error);
//     }
//   }
// 
//   const handleSwitch = () => {
//     try {
// 
//       switchNetwork(process.env.REACT_APP_L2_CHAIN_ID)
//     }
//     catch (error) {
//       console.log(error);
//     }
//   }
//   ////========================================================== HANDLE CHANGE =======================================================================
//   const [checkDisabled, setCheckDisabled] = useState(false)
// 
//   const handleChange = (e) => {
//     if (sendToken == "WIBE") {
//       if (Number(data?.formatted) < Number(e.target.value)) {
//         setCheckDisabled(true)
//         setErrorInput("Insufficient WIBE balance.")
//       } else {
//         setCheckDisabled(false)
//         setErrorInput("")
//       }
//       setEthValue(e.target.value)
//     }
//   }
//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(transactionHash);
//     alert("Transaction Hash Copied!");
//   };
// 
//   // ============= For Format balance =========================
//   const formatBalance = (rawBalance) => {
//     const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(6)
//     return balance
//   }
//   // ============= Get and update balance =========================
//   const updateWallet = async () => {
//     const balance = formatBalance(await window.ethereum.request({
//       method: "eth_getBalance",
//       params: [address, "latest"]
//     }))
//     setRaceBalance(balance)
//   }
// 
//   useEffect(() => {
//     updateWallet()
// 
//   }, [data])
//   return (
//     <>
//       <div className='bridge_wrap'>
//         <TabMenu />
//         <section className='deposit_wrap'>
//           <div className='withdraw_title_wrap'>
//             <div className='withdraw_title_icn'>
//               <MdOutlineSecurity />
//             </div>
//             <div className='withdraw_title_content'>
//               <h3>Step 1: Initiate Withdrawal</h3>
//               <p>You initiate the withdrawal on the L2 network.</p>
//               <p>Bridge token to Ethereum</p>
//             </div>
//           </div>
//           <div className='deposit_price_wrap'>
//             <div className='deposit_price_title'>
//               <p>From</p>
//               <h5><Image src={toIcn} alt="To icn" fluid /> Wibe </h5>
//             </div>
//             <div className='deposit_input_wrap'>
//               <Form>
//                 <div className='deposit_inner_input'>
//                   <Form.Control type='number' name="eth_value" value={ethValue} onChange={handleChange} placeholder="0" min="0" step="any" />
//                   <div className='select_wrap'>
//                     <span>WIBE</span>
//                   </div>
//                 </div>
//                 <div className='input_icn_wrap'>
//                   <span className='input_icn'><img src={require("../assets/images/wibe.png")} alt="WIBE Logo" style={{ width: '24px', height: '24px' }} /></span>
//                 </div>
//               </Form>
// 
//             </div>
//             {errorInput && <small className='text-danger'>{errorInput}</small>}
//             {address && <p className='wallet_bal mt-2'>Balance: {Number(data?.formatted).toFixed(5)} WIBE</p>}
//           </div>
//           <div className='deposit_details_wrap'>
//             <div className="deposit_details">
//               <p>To:</p>
//               <h5><FaEthereum /> Sepolia Testnet</h5>
//             </div>
//             <div className='withdraw_bal_sum'>
//               <span className='input_icn'><img src={require("../assets/images/wibe.png")} alt="WIBE Logo" style={{ width: '24px', height: '24px' }} /></span>
//               <p>You'll receive: {ethValue ? ethValue : "0"} WIBE</p>
//               <div></div>
//             </div>
//           </div>
//           <div className="deposit_btn_wrap">
//             {checkMetaMask === true ? <a className='btn deposit_btn' href='https://metamask.io/' target='_blank'><Image src={metamask} alt="metamask icn" fluid /> Please Install Metamask Wallet</a> : !isConnected ? <button className='btn deposit_btn' onClick={() => connect()}><IoMdWallet />Connect Wallet</button> : chain.id !== Number(process.env.REACT_APP_L2_CHAIN_ID) ? <button className='btn deposit_btn' onClick={handleSwitch}><HiSwitchHorizontal />Switch to Wibe Testnet</button> :
//               checkDisabled ? <button className='btn deposit_btn' disabled={true}>Withdraw</button> :
//                 <button className='btn deposit_btn' onClick={handleWithdraw} disabled={loader ? true : false}>{loader ? <Spinner animation="border" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </Spinner> : "Withdraw"}</button>}
//           </div>
//           <div className="transaction_details">
//             <p>Withdrawal Steps: (For WIBE Withdrawals)</p>
//             <br></br>
//             <p>
//               <div className='withdraw_title_content'>
// 
//                 <h5>Withdrawals require the user to submit three transactions:</h5>
//                 <br></br>
//                 <p>1. Withdrawal initiating transaction, which the user submits on L2.</p>
//                 <p>2. Withdrawal proving transaction, which the user submits on L1 to prove that the withdrawal is legitimate (based on a Merkle-Patricia trie root that commits to the state of the L2ToL1MessagePasser's storage on L2)</p>
//                 <p>3. Withdrawal finalizing transaction, which the user submits on L1 after the fault challenge period has passed, to actually run the transaction on L1.</p>
//               </div>
// 
//             </p>
//             <p>
//               Once your transaction is confirmed, you can{" "}
//               <a href="https://testnet.wibeswap.com/prove-and-finalize/" target="_blank" rel="noopener noreferrer">
//                 click here
//               </a>{" "}
//               to prove finalize your withdrawal and complete the process.
//             </p>
//           </div>
//           {transactionHash && (
//             <>
//               <div className="transaction_details">
//                 <p>Transaction Hash:</p>
//                 <a
//                   href={`https://testnet.wibescan.com/tx/${transactionHash}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   {transactionHash}
//                 </a>
//                 <button onClick={copyToClipboard} className="copy_button">
//                   Copy Transaction Hash
//                 </button>
//               </div>
//             </>
//           )}
// 
//           {metaMastError && <small className="d-block text-danger text-center mt-2">{metaMastError}</small>}
//         </section>
//       </div>
//     </>
//   )
// }
// 
// export default Withdraw