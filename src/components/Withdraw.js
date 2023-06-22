import React, { useEffect, useState } from 'react';
import "../assets/style/deposit.scss";
import "../assets/style/withdraw.scss";
import { Container, Form, Image, Spinner } from "react-bootstrap";
import { MdOutlineSecurity } from "react-icons/md"
import { FaEthereum } from "react-icons/fa"
import toIcn from "../assets/images/logo.png"
import { useAccount, useConnect, useNetwork, useSwitchNetwork, useBalance, useWaitForTransaction } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected';
import { IoMdWallet } from "react-icons/io"
import { HiSwitchHorizontal } from "react-icons/hi";
import TabMenu from './TabMenu';
const optimismSDK = require("@eth-optimism/sdk")
const ethers = require("ethers")
const Withdraw = () => {
  const [ethValue, setEthValue] = useState("")
  const [errorInput, setErrorInput] = useState("")
  const [loader, setLoader] = useState(false)
  const { address, isConnected } = useAccount()
  const { data, isError, isLoading } = useBalance({ address: address, chainId: 90001 })
  const { connect } = useConnect({ connector: new InjectedConnector() })
  const { chain } = useNetwork()
  const waitForTransaction = useWaitForTransaction({})
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
  useEffect(() => {
    console.log("data", data);

  }, [data])
  const handleWithdraw = async () => {
    try {
      if (!parseFloat(ethValue) > 0) {
        setErrorInput("Amount Invalid!");
      } else {
        setErrorInput("");
        // const l1Provider = new ethers.providers.Web3Provider(window.ethereum);
        // const l2Provider = new ethers.providers.Web3Provider(window.ethereum);
        const l1Url = `https://eth-goerli.g.alchemy.com/v2/e0CsbXjGCT0xVVFc9MyaE7-olvSVAh4S`;
        const l2Url = `https://racetestnet.io`;
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
        const weiValue = parseInt(ethers.utils.parseEther(ethValue)._hex, 16)
        setLoader(true);
        const response = await crossChainMessenger.withdrawETH(weiValue.toString());
        const logs = await response.wait();
        console.log({ response, logs });
        if (logs) {
          setLoader(false);
          setEthValue("");
        }

      }
    } catch (error) {
      if(error === "user rejected transaction"){
        console.log(true);
      }
    }
  }

  const handleSwitch = () => {
    switchNetwork(process.env.REACT_APP_L2_CHAIN_ID)
  }
  const handleChange = (e) => {
    if (data?.formatted < e.target.value) {
      setErrorInput("Insufficient ETH balance.")
    } else {
      setErrorInput("")
    }
    setEthValue(e.target.value)
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
                  <Form.Select aria-label="Default select example" className='select_wrap'>
                    <option>ETH</option>
                    {/* <option value="DAI">DAI</option>
                  <option value="USDT">USDC</option>
                  <option value="USDT">USDT</option> */}
                  </Form.Select>
                </div>
                <div className='input_icn_wrap'>
                  <span className='input_icn'><Image src={toIcn} alt="To icn" fluid /></span>
                </div>
              </Form>
            </div>
            {errorInput && <small className='text-danger'>{errorInput}</small>}
            {address && <p className='wallet_bal mt-2'>Balance: {Number(data?.formatted).toFixed(5)} ETH</p>}
          </div>
          <div className='deposit_details_wrap'>
            <div className="deposit_details">
              <p>To:</p>
              <h5><FaEthereum /> Goerli Testnet</h5>
            </div>
            <div className='withdraw_bal_sum'>
              <span className='input_icn'><FaEthereum /></span>
              <p>You’ll receive: {ethValue ? ethValue : "0"} ETH</p>
              <div></div>
              {/* <span className='input_title'>ETH</span> */}
            </div>
          </div>
          <div className="deposit_btn_wrap">
            {!isConnected ? <button className='btn deposit_btn' onClick={() => connect()}><IoMdWallet />Connect Wallet</button> : chain.id !== Number(process.env.REACT_APP_L2_CHAIN_ID) ? <button className='btn deposit_btn' onClick={handleSwitch}><HiSwitchHorizontal />Switch to RACE Testnet</button> : <button className='btn deposit_btn' onClick={handleWithdraw} disabled={loader ? true : false}>{loader ? <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner> : "Withdraw"}</button>}
          </div>
        </section>
      </div>
    </>
  )
}

export default Withdraw