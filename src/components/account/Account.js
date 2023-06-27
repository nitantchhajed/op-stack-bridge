import React, { useState } from 'react'
import "../../assets/style/account/account.scss"
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { MdContentCopy } from "react-icons/md"
import { useAccount } from "wagmi"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link, useLocation } from 'react-router-dom'
const Account = () => {
    const [copyTextSourceCode, setCopyTextSourceCode] = useState("Copy address to clipboard")
    const location = useLocation()
    const { address, isConnected } = useAccount();
    const handleSourceCopy = () => {
        if (copyTextSourceCode === "Copy address to clipboard") {
            setCopyTextSourceCode("Copied.")
        }
    };
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {copyTextSourceCode}
        </Tooltip>
    );
    return (
        <>
            <div className='account_title'>
                <h3>Account</h3>
                {
                    isConnected &&
                    <h6>
                        <span>{address}</span> <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 250 }}
                            overlay={renderTooltip}>

                            <CopyToClipboard text={address}>
                                <span className="d-inline-block"> <MdContentCopy onClick={handleSourceCopy} /> </span>
                            </CopyToClipboard>

                        </OverlayTrigger>
                    </h6>
                }
            </div>
            <div className='account_tabs'>
                <ul>
                    <li><Link to="/account/deposit" className={`${location.pathname == "/account/deposit" ? "active" : ""}`}>Deposit</Link></li>
                    <li><Link to="/account/withdraw" className={`${location.pathname == "/account/withdraw" ? "active" : ""}`}>Withdraw</Link></li>
                </ul>
            </div>
        </>
    )
}

export default Account