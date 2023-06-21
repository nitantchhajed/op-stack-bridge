import React, { useEffect, useState } from 'react';
import "../assets/style/deposit.scss";
import "../assets/style/withdraw.scss";
import { Form, Image } from "react-bootstrap";
import { MdOutlineSecurity } from "react-icons/md"
import { FaEthereum } from "react-icons/fa"
import toIcn from "../assets/images/logo.png"
const Withdraw = () => {
  return (
    <>
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
                <Form.Control type='number' name="eth_value" placeholder="0"/>
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
          <small className='text-danger'></small>
        </div>
        <div className='deposit_details_wrap'>
          <div className="deposit_details">
            <p>To:</p>
            <h5><FaEthereum /> Goerli Testnet</h5>
          </div>
          <div className='withdraw_bal_sum'>
            <span className='input_icn'><FaEthereum /></span>
            <p>You’ll receive: 0 ETH</p>
            <div></div>
            {/* <span className='input_title'>ETH</span> */}
          </div>
        </div>
        <div className="deposit_btn_wrap">
          <button className='btn deposit_btn'>Switch to RACE Testnet</button>
        </div>

      </section>

    </>
  )
}

export default Withdraw