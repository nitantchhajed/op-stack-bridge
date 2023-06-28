import React, { useEffect, useState } from 'react';
import "../assets/style/deposit.scss";
import "../assets/style/withdraw.scss";
import { Form, Image, Spinner } from "react-bootstrap";
import { Dai, Usdt } from 'react-web3-icons';
import { MdOutlineSecurity } from "react-icons/md"
import { FaEthereum } from "react-icons/fa"
import Web3 from 'web3';
import toIcn from "../assets/images/logo.png"
import { useAccount, useConnect, useNetwork, useSwitchNetwork, useBalance } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected';
import { IoMdWallet } from "react-icons/io"
import { HiSwitchHorizontal } from "react-icons/hi";
import metamask from "../assets/images/metamask.svg"
import TabMenu from './TabMenu';
const optimismSDK = require("@eth-optimism/sdk")
const ethers = require("ethers")
const Withdraw = () => {
  const [ethValue, setEthValue] = useState("")
  const [sendToken, setSendToken] = useState("ETH")
  const [errorInput, setErrorInput] = useState("")
  const [checkMetaMask, setCheckMetaMask] = useState("");
  const [loader, setLoader] = useState(false)
  const { address, isConnected } = useAccount()
  const { data } = useBalance({ address: address, chainId: 90001 })
  const { chain, chains } = useNetwork()
  const { connect } = useConnect({
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
  const [metaMastError, setMetaMaskError] = useState("")
  const { error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork({
    // throwForSwitchChainNotSupported: true,
    chainId: 90001,
    onError(error) {
      console.log('Error', error)
    },
    onMutate(args) {
      console.log('Mutate', args)
    },
    onSettled(data, error) {
      console.log('Settled', { data, error })
      try {
        window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: process.env.REACT_APP_L2_CHAIN_ID_WITH_HEX,
            rpcUrls: [process.env.REACT_APP_L2_RPC_URL],
            chainName: process.env.REACT_APP_L2_NETWORK_NAME,
            nativeCurrency: {
              name: "ETHEREUM",
              symbol: "ETH",
              decimals: 18
            },
            blockExplorerUrls: [process.env.REACT_APP_L2_EXPLORER_URL]
          }]
        }).then((data) => {
          setMetaMaskError("")
        }).catch((err) => {
          if (err.code === -32002) {
            setMetaMaskError("Request stuck in pending state")
          }
        });
      }
      catch (error) {
        console.log(error);
      }
    },
    onSuccess(data) {
      console.log('Success', data)

    },
  })

  const dataUSDT = useBalance({ address: address, chainId: Number(process.env.REACT_APP_L2_CHAIN_ID), token: process.env.REACT_APP_L2_USDT });
  const dataDAI = useBalance({ address: address, chainId: Number(process.env.REACT_APP_L2_CHAIN_ID), token: process.env.REACT_APP_L2_DAI });
  // console.log(dataUSDT, "usdt");
  // console.log(dataDAI, "dai");
  const handleWithdraw = async () => {
    try {
      if (!ethValue) {
        setErrorInput("Please enter the amount");
      }
      else {
        if (!parseFloat(ethValue) > 0) {
          setErrorInput("Amount Invalid!");
        } else {
          setErrorInput("");
          const l1Url = process.env.REACT_APP_L1_RPC_URL;
          const l1Provider = new ethers.providers.JsonRpcProvider(l1Url, "any");
          const l2Provider = new ethers.providers.Web3Provider(window.ethereum);
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

          try {
            if (sendToken == "ETH") {
              const weiValue = parseInt(ethers.utils.parseEther(ethValue)._hex, 16)
              setLoader(true);
              const response = await crossChainMessenger.withdrawETH(weiValue.toString());
              const logs = await response.wait();
              console.log({ response });
              console.log({ logs });
              if (logs) {
                setLoader(false);
                setEthValue("");
              }

            }
            if (sendToken == "DAI") {
              var daiValue = Web3.utils.toWei(ethValue, "ether")
              setLoader(true);
              var depositTxn2 = await crossChainMessenger.withdrawERC20("0xb93cba7013f4557cDFB590fD152d24Ef4063485f", "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", daiValue);;
              var receiptDAI = await depositTxn2.wait()
              console.log(receiptDAI);
              if (receiptDAI) {
                setLoader(false);
                setEthValue("")
              }
            }

            if (sendToken == "USDT") {
              var usdtValue = parseInt(ethValue * 1000000)
              setLoader(true);
              var receiptUSDT = await crossChainMessenger.withdrawERC20("0xfad6367E97217cC51b4cd838Cc086831f81d38C2", "0x4faf8Ba72fa0105c90A339453A420866388071a0", usdtValue)
              var getReceiptUSDT = await receiptUSDT.wait();
              if (getReceiptUSDT) {
                setLoader(false);
                setEthValue("")
              }
            }

          }
          catch (error) {
            setLoader(false);
            console.log({ error }, 98);
          }
        }
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleSwitch = () => {
    try {

      switchNetwork(process.env.REACT_APP_L2_CHAIN_ID)
    }
    catch (error) {
      console.log(error);
    }
  }
  const handleChange = (e) => {
    if (sendToken == "ETH"){
    if (data?.formatted < e.target.value) {
      setErrorInput("Insufficient ETH balance.")
    } else {
      setErrorInput("")
    }
    setEthValue(e.target.value)
  }
  if (sendToken == "DAI"){
    if (dataDAI.data?.formatted < e.target.value) {
      setErrorInput("Insufficient DAI balance.")
    } else {
      setErrorInput("")
    }
    setEthValue(e.target.value)
  }
  if (sendToken == "USDT"){
    if (dataUSDT.data?.formatted < e.target.value) {
      setErrorInput("Insufficient DAI balance.")
    } else {
      setErrorInput("")
    }
    setEthValue(e.target.value)
  }
}
  return (
    <>
      <div className='bridge_wrap'>
        <TabMenu />
        <section className='deposit_wrap'>
          <div className='withdraw_title_wrap'>
            <div className='withdraw_title_icn'>
              <MdOutlineSecurity />
            </div>
            <div className='withdraw_title_content'>
              <h3>Use the official bridge</h3>
              <p>This usually takes 7 days</p>
              <p>Bridge any token to Ethereum Mainnet</p>
            </div>
          </div>
          <div className='deposit_price_wrap'>
            <div className='deposit_price_title'>
              <p>From</p>
              <h5><Image src={toIcn} alt="To icn" fluid /> Race</h5>
            </div>
            <div className='deposit_input_wrap'>
              <Form>
                <div className='deposit_inner_input'>
                  <Form.Control type='number' name="eth_value" value={ethValue} onChange={handleChange} placeholder="0" min="0" step="any" />
                  <Form.Select aria-label="Default select example" className='select_wrap' onChange={({ target }) => setSendToken(target.value)}>
                    <option>ETH</option>
                    <option value="DAI">DAI</option>
                    <option value="USDT">USDT</option>
                  </Form.Select>
                </div>
                <div className='input_icn_wrap'>
                  {sendToken == "ETH" ? <span className='input_icn'><FaEthereum /></span> : sendToken == "DAI" ? <span className='input_icn'><Dai /></span> : <span className='input_icn'><Usdt /></span>}
                </div>
              </Form>
            </div>
            {errorInput && <small className='text-danger'>{errorInput}</small>}
            {sendToken === "ETH" ? address && <p className='wallet_bal mt-2'>Balance: {Number(data?.formatted).toFixed(5)} ETH</p> : sendToken === "DAI" ? address && <p className='wallet_bal mt-2'>Balance: {Number(dataDAI.data?.formatted).toFixed(5)} DAI</p> : <p className='wallet_bal mt-2'>Balance: {Number(dataUSDT.data?.formatted).toFixed(5)} USDT</p>}
          </div>
          <div className='deposit_details_wrap'>
            <div className="deposit_details">
              <p>To:</p>
              <h5><FaEthereum /> Goerli Testnet</h5>
            </div>
            <div className='withdraw_bal_sum'>
              {sendToken == "ETH" ? <span className='input_icn'><FaEthereum /></span> : sendToken == "DAI" ? <span className='input_icn'><Dai /></span> : <span className='input_icn'><Usdt /></span>}
              <p>You’ll receive: {ethValue ? ethValue : "0"} {sendToken}</p>
              <div></div>
              {/* <span className='input_title'>ETH</span> */}
            </div>
          </div>
          <div className="deposit_btn_wrap">
            {checkMetaMask === true ? <a className='btn deposit_btn' href='https://metamask.io/' target='_blank'><Image src={metamask} alt="metamask icn" fluid /> Please Install Metamask Wallet</a> : !isConnected ? <button className='btn deposit_btn' onClick={() => connect()}><IoMdWallet />Connect Wallet</button> : chain.id !== Number(process.env.REACT_APP_L2_CHAIN_ID) ? <button className='btn deposit_btn' onClick={handleSwitch}><HiSwitchHorizontal />Switch to RACE Testnet</button> : <button className='btn deposit_btn' onClick={handleWithdraw} disabled={loader ? true : false}>{loader ? <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner> : "Withdraw"}</button>}
          </div>
          {metaMastError && <small className="d-block text-danger text-center mt-2">{metaMastError}</small>}
        </section>
      </div>
    </>
  )
}

export default Withdraw